import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

function parsePct(val: string): number {
  const cleaned = val.replace(/[^0-9.,-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function parseNumber(val: string): number {
  const cleaned = val.replace(/[^0-9.,-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export async function POST(req: Request) {
  try {
    const { proballersUrl } = await req.json();
    if (!proballersUrl) {
      return NextResponse.json({ error: "proballersUrl es requerido" }, { status: 400 });
    }

    const url = proballersUrl.replace(/\/$/, "");

    const { stdout: html } = await execAsync(
      `curl -sL "${url}" ` +
      `-H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" ` +
      `-H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8" ` +
      `-H "Accept-Language: en-US,en;q=0.9" ` +
      `-H "Referer: https://www.proballers.com/" ` +
      `-H "Sec-Fetch-Dest: document" ` +
      `-H "Sec-Fetch-Mode: navigate" ` +
      `-H "Sec-Fetch-Site: same-origin" ` +
      `-H "Sec-Fetch-User: ?1" ` +
      `-H "Upgrade-Insecure-Requests: 1"`,
      { timeout: 15000 }
    );

    if (!html || html.length < 1000 || html.includes("challenge-platform") || html.includes("cf-browser-verify")) {
      return NextResponse.json({ error: "Proballers esta protegido por Cloudflare y no se puede acceder desde el servidor. Como alternativa, el Super Admin puede copiar manualmente los datos desde proballers.com." }, { status: 502 });
    }

    const cheerio = await import("cheerio");
    const $ = cheerio.load(html);

    const tables = $("table").filter((_, el) => {
      const header = $(el).find("thead tr th").first();
      return header.text().trim() === "Player";
    });

    if (tables.length === 0) {
      return NextResponse.json({ error: "No se encontro la tabla de estadisticas" }, { status: 404 });
    }

    const statsTable = $(tables[0]);
    const players: Array<{
      playerName: string;
      height: string;
      age: number;
      pointsPerGame: number;
      reboundsPerGame: number;
      assistsPerGame: number;
      gamesPlayed: number;
      minutesPerGame: number;
      threePointPct: number;
      fieldGoalPct: number;
      freeThrowPct: number;
      stealsPerGame: number;
      blocksPerGame: number;
      turnovers: number;
      fouls: number;
      efficiency: number;
    }> = [];

    statsTable.find("tbody tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length < 21) return;

      const name = $(cells[0]).text().trim();
      if (!name) return;

      const pts = parseNumber($(cells[3]).text());
      const reb = parseNumber($(cells[4]).text());
      const ast = parseNumber($(cells[5]).text());
      const gp = parseNumber($(cells[6]).text());
      const min = parseNumber($(cells[8]).text());
      const threePct = parsePct($(cells[9]).text());
      const fgPct = parsePct($(cells[10]).text());
      const ftPct = parsePct($(cells[11]).text());
      const stl = parseNumber($(cells[15]).text());
      const to = parseNumber($(cells[16]).text());
      const blk = parseNumber($(cells[17]).text());
      const fo = parseNumber($(cells[18]).text());
      const eff = parseNumber($(cells[20]).text());

      players.push({
        playerName: name,
        height: $(cells[1]).text().trim(),
        age: parseNumber($(cells[2]).text().trim()),
        pointsPerGame: pts,
        reboundsPerGame: reb,
        assistsPerGame: ast,
        gamesPlayed: gp,
        minutesPerGame: min,
        threePointPct: threePct / 100,
        fieldGoalPct: fgPct / 100,
        freeThrowPct: ftPct / 100,
        stealsPerGame: stl,
        blocksPerGame: blk,
        turnovers: to,
        fouls: fo,
        efficiency: eff,
      });
    });

    if (players.length === 0) {
      return NextResponse.json({ error: "No se encontraron jugadores en la tabla" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      url,
      players,
      count: players.length,
      scrapedAt: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
