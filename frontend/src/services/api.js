const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}
