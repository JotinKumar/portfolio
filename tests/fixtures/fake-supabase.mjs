import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
  readFileSync(new URL("./responsive-hero-data.json", import.meta.url), "utf8")
);
const port = Number(process.env.FAKE_SUPABASE_PORT ?? 54329);
const host = "127.0.0.1";

const rowsByTable = {
  HeroContent: [fixture.heroContent],
  SiteConfig: [fixture.siteConfig],
  NavigationItem: [],
  SocialLink: [],
  WorkExperienceCard: [],
  Blog: [],
  Project: [],
  ProfileMilestone: [],
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${host}:${port}`);

  if (url.pathname === "/health") {
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("ok");
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, apikey, content-type, prefer",
    });
    response.end();
    return;
  }

  if (request.method === "GET" && url.pathname.startsWith("/rest/v1/")) {
    const table = decodeURIComponent(url.pathname.slice("/rest/v1/".length));
    const rows = rowsByTable[table] ?? [];
    const wantsObject = request.headers.accept?.includes(
      "application/vnd.pgrst.object+json"
    );
    const body = wantsObject ? rows[0] ?? null : rows;

    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers": "Content-Range",
      "Content-Range": rows.length > 0 ? `0-${rows.length - 1}/${rows.length}` : "*/0",
      "Content-Type": "application/json; charset=utf-8",
    });
    response.end(JSON.stringify(body));
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ message: "Not found" }));
});

server.listen(port, host);

const closeServer = () => {
  server.close(() => process.exit(0));
};

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);
