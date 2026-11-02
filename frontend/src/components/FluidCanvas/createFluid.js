// A compact WebGL2 stable-fluids simulation (advection, vorticity, pressure solve).
// Returns null when the browser can't render to half-float textures.

const DEFAULTS = {
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 1,
  velocityDissipation: 0.35,
  pressure: 0.8,
  pressureIterations: 20,
  curl: 28,
  splatRadius: 0.22,
}

const VERTEX = `#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 texelSize;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const fragment = (body) => `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
${body}`

const SHADERS = {
  display: `
uniform sampler2D uTexture;
void main() {
  vec3 c = min(texture(uTexture, vUv).rgb, vec3(1.0));
  float a = max(c.r, max(c.g, c.b));
  fragColor = vec4(c, a);
}`,
  splat: `
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main() {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  fragColor = vec4(texture(uTarget, vUv).xyz + splat, 1.0);
}`,
  advection: `
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  fragColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  divergence: `
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  fragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: `
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradientSubtract: `
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}`,
  clear: `
uniform sampler2D uTexture;
uniform float value;
void main() {
  fragColor = value * texture(uTexture, vUv);
}`,
}

export function createFluid(canvas) {
  // Live settings; callers may change these between frames.
  const config = { ...DEFAULTS }
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  })
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) return null

  const compile = (type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader))
    return shader
  }

  const vertexShader = compile(gl.VERTEX_SHADER, VERTEX)
  const programs = {}
  for (const [name, body] of Object.entries(SHADERS)) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment(body)))
    gl.bindAttribLocation(program, 0, 'aPosition')
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program))

    const uniforms = {}
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < count; i++) {
      const uniformName = gl.getActiveUniform(program, i).name
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName)
    }
    programs[name] = () => {
      gl.useProgram(program)
      return uniforms
    }
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)
  gl.clearColor(0, 0, 0, 0)

  const blit = (target) => {
    if (target) {
      gl.viewport(0, 0, target.width, target.height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  }

  const createTarget = (width, height) => {
    gl.activeTexture(gl.TEXTURE0)
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null)

    const fbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    gl.viewport(0, 0, width, height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    return {
      texture,
      fbo,
      width,
      height,
      attach(unit) {
        gl.activeTexture(gl.TEXTURE0 + unit)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        return unit
      },
      dispose() {
        gl.deleteTexture(texture)
        gl.deleteFramebuffer(fbo)
      },
    }
  }

  const createDoubleTarget = (width, height) => {
    let read = createTarget(width, height)
    let write = createTarget(width, height)
    return {
      width,
      height,
      get read() {
        return read
      },
      get write() {
        return write
      },
      swap() {
        ;[read, write] = [write, read]
      },
      dispose() {
        read.dispose()
        write.dispose()
      },
    }
  }

  const resolution = (base) => {
    let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight
    if (aspect < 1) aspect = 1 / aspect
    const min = Math.round(base)
    const max = Math.round(base * aspect)
    return gl.drawingBufferWidth > gl.drawingBufferHeight
      ? { width: max, height: min }
      : { width: min, height: max }
  }

  let velocity, dye, pressure, divergence, curl

  const disposeTargets = () => {
    for (const target of [velocity, dye, pressure, divergence, curl]) target?.dispose()
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr))
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr))
    if (canvas.width === width && canvas.height === height && velocity) return
    canvas.width = width
    canvas.height = height

    disposeTargets()
    const sim = resolution(config.simResolution)
    const dyeRes = resolution(config.dyeResolution)
    velocity = createDoubleTarget(sim.width, sim.height)
    pressure = createDoubleTarget(sim.width, sim.height)
    divergence = createTarget(sim.width, sim.height)
    curl = createTarget(sim.width, sim.height)
    dye = createDoubleTarget(dyeRes.width, dyeRes.height)
  }

  const splat = (x, y, dx, dy, color) => {
    const aspect = canvas.width / canvas.height
    const radius = (config.splatRadius / 100) * (aspect > 1 ? aspect : 1)
    const u = programs.splat()
    gl.uniform1f(u.aspectRatio, aspect)
    gl.uniform2f(u.point, x, y)
    gl.uniform1f(u.radius, radius)

    gl.uniform1i(u.uTarget, velocity.read.attach(0))
    gl.uniform3f(u.color, dx, dy, 0)
    blit(velocity.write)
    velocity.swap()

    gl.uniform1i(u.uTarget, dye.read.attach(0))
    gl.uniform3f(u.color, color[0], color[1], color[2])
    blit(dye.write)
    dye.swap()
  }

  const step = (dt) => {
    gl.disable(gl.BLEND)
    const tx = 1 / velocity.width
    const ty = 1 / velocity.height

    let u = programs.curl()
    gl.uniform2f(u.texelSize, tx, ty)
    gl.uniform1i(u.uVelocity, velocity.read.attach(0))
    blit(curl)

    u = programs.vorticity()
    gl.uniform2f(u.texelSize, tx, ty)
    gl.uniform1i(u.uVelocity, velocity.read.attach(0))
    gl.uniform1i(u.uCurl, curl.attach(1))
    gl.uniform1f(u.curl, config.curl)
    gl.uniform1f(u.dt, dt)
    blit(velocity.write)
    velocity.swap()

    u = programs.divergence()
    gl.uniform2f(u.texelSize, tx, ty)
    gl.uniform1i(u.uVelocity, velocity.read.attach(0))
    blit(divergence)

    u = programs.clear()
    gl.uniform1i(u.uTexture, pressure.read.attach(0))
    gl.uniform1f(u.value, config.pressure)
    blit(pressure.write)
    pressure.swap()

    u = programs.pressure()
    gl.uniform2f(u.texelSize, tx, ty)
    gl.uniform1i(u.uDivergence, divergence.attach(0))
    for (let i = 0; i < config.pressureIterations; i++) {
      gl.uniform1i(u.uPressure, pressure.read.attach(1))
      blit(pressure.write)
      pressure.swap()
    }

    u = programs.gradientSubtract()
    gl.uniform2f(u.texelSize, tx, ty)
    gl.uniform1i(u.uPressure, pressure.read.attach(0))
    gl.uniform1i(u.uVelocity, velocity.read.attach(1))
    blit(velocity.write)
    velocity.swap()

    u = programs.advection()
    gl.uniform2f(u.texelSize, tx, ty)
    gl.uniform1f(u.dt, dt)
    gl.uniform1i(u.uVelocity, velocity.read.attach(0))
    gl.uniform1i(u.uSource, velocity.read.attach(0))
    gl.uniform1f(u.dissipation, config.velocityDissipation)
    blit(velocity.write)
    velocity.swap()

    gl.uniform1i(u.uVelocity, velocity.read.attach(0))
    gl.uniform1i(u.uSource, dye.read.attach(1))
    gl.uniform1f(u.dissipation, config.densityDissipation)
    blit(dye.write)
    dye.swap()
  }

  const render = () => {
    const u = programs.display()
    gl.uniform1i(u.uTexture, dye.read.attach(0))
    blit(null)
  }

  // Free GPU memory but keep the context alive: React may remount on the same canvas,
  // and getContext() returns the same (now lost) context after loseContext().
  const destroy = () => {
    disposeTargets()
  }

  resize()
  return { config, resize, splat, step, render, destroy }
}
