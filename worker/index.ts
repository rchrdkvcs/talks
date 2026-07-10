interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

// Invoked only when no static asset matches the request.
// Slidev builds are SPAs: deep links like /{slug}/5 must fall back
// to that talk's index.html so client-side routing can take over.
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const match = url.pathname.match(/^\/([^/]+)(\/|$)/)

    if (match && match[1] !== 'artifacts') {
      // Fetch the directory path, not index.html: asset serving would 307 an
      // explicit index.html back to the directory, dropping the original URL.
      const indexUrl = new URL(`/${match[1]}/`, url.origin)
      const fallback = await env.ASSETS.fetch(new Request(indexUrl, request))
      if (fallback.status !== 404)
        return fallback
    }

    return env.ASSETS.fetch(request)
  },
}
