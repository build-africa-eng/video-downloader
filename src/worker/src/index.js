export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const token = request.headers.get("X-Access-Token");

    if (token !== env.SECRET_TOKEN) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (url.pathname === "/download") {
      const videoUrl = url.searchParams.get("url");
      const response = await fetch(`${env.RENDER_URL}?url=${encodeURIComponent(videoUrl)}`, {
        headers: { Authorization: `Bearer ${env.RENDER_TOKEN}` },
      });
      if (response.ok) {
        const downloadLink = await response.text();
        await env.DB.prepare("INSERT INTO downloads (video_url, download_link) VALUES (?, ?)")
          .bind(videoUrl, downloadLink)
          .run();
        return new Response(downloadLink, { headers: { "Content-Type": "text/plain" } });
      }
      return new Response("Download failed", { status: 500 });
    }

    return new Response("Not found", { status: 404 });
  },
};