import { useEffect, useState } from 'react'
import { lenis } from '../hooks/useLenis.js'
import { ScrollTrigger } from './gsap.js'

// A tiny path router: the site is one page plus a few legal pages, so a library isn't needed.

const listeners = new Set()

export function navigate(path) {
  if (path === window.location.pathname + window.location.hash) return
  window.history.pushState({}, '', path)
  listeners.forEach((fn) => fn())
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    listeners.add(update)
    window.addEventListener('popstate', update)
    return () => {
      listeners.delete(update)
      window.removeEventListener('popstate', update)
    }
  }, [])

  // Each page starts at its top (or at its #section, for links like "/#about").
  // The jump repeats once the new page's animations have laid themselves out.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    const jump = () => {
      const target = id && document.getElementById(id)
      if (lenis) lenis.scrollTo(target || 0, { immediate: true })
      else if (target) target.scrollIntoView()
      else window.scrollTo(0, 0)
    }
    const frame = requestAnimationFrame(jump)
    const settle = id ? setTimeout(() => {
      ScrollTrigger.refresh()
      jump()
    }, 500) : null
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settle)
    }
  }, [path])

  return path
}
