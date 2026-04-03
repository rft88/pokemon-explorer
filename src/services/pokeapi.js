const BASE = 'https://pokeapi.co/api/v2'
const ENDPOINT = 'pokemon'

export function buildUrl(id = '') {
  const resource = id.trim() ? `${ENDPOINT}/${id.trim()}/` : `${ENDPOINT}/`
  return `${BASE}/${resource}`
}

export async function fetchResource(id = '') {
  const url = buildUrl(id)
  const t0 = performance.now()

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  const elapsed = Math.round(performance.now() - t0)

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} — ${res.statusText}`)
    err.status = res.status
    err.url = url
    err.elapsed = elapsed
    throw err
  }

  const data = await res.json()
  return { data, status: res.status, url, elapsed }
}
