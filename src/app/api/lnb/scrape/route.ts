import { NextResponse } from "next/server";
import { Timestamp } from "firebase/firestore";

const LNB_STATS_URL = "https://lnbchile.com/liga/uno/stats";

type LNBPlayerRaw = {
  name: string;
  team: string;
  pos: string;
  gp: number;
  min: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
  eff: number;
};

function parseNumber(val: string): number {
  const cleaned = val.replace(/[^0-9.,-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export async function POST(req: Request) {
  try {
    const { lnbTeamName } = await req.json();
    if (!lnbTeamName) {
      return NextResponse.json({ error: "lnbTeamName es requerido" }, { status: 400 });
    }

    const response = await fetch(LNB_STATS_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TOALESCO/1.0)" },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Error al obtener la pagina: ${response.status}` }, { status: 502 });
    }

    const html = await response.text();
    const cheerio = await import("cheerio");
    const $ = cheerio.load(html);

    const players: LNBPlayerRaw[] = [];

    $("table tbody tr, .stats-table tbody tr, .table tbody tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length < 10) return;

      const name = $(cells[0]).text().trim();
      const team = $(cells[1]).text().trim();
      const pos = $(cells[2]).text().trim();

      if (!name || team.toLowerCase() !== lnbTeamName.toLowerCase()) return;

      players.push({
        name,
        team,
        pos,
        gp: parseNumber($(cells[3]).text()),
        min: parseNumber($(cells[4]).text()),
        pts: parseNumber($(cells[5]).text()),
        reb: parseNumber($(cells[6]).text()),
        ast: parseNumber($(cells[7]).text()),
        stl: parseNumber($(cells[8]).text()),
        blk: parseNumber($(cells[9]).text()),
        fgPct: parseNumber($(cells[10])?.text() ?? "0"),
        threePct: parseNumber($(cells[11])?.text() ?? "0"),
        ftPct: parseNumber($(cells[12])?.text() ?? "0"),
        eff: parseNumber($(cells[13])?.text() ?? "0"),
      });
    });

    if (players.length === 0) {
      const teamsFound = new Set<string>();
      $("table tbody tr, .stats-table tbody tr, .table tbody tr").each((_, row) => {
        const cell = $(row).find("td").eq(1);
        if (cell.length) teamsFound.add(cell.text().trim());
      });
      return NextResponse.json({
        error: `No se encontraron jugadores para "${lnbTeamName}". Equipos disponibles: ${[...teamsFound].join(", ") || "no se pudo detectar la estructura de la tabla"}`,
        teamsFound: [...teamsFound],
      }, { status: 404 });
    }

    const formatted = players.map((p) => ({
      playerName: p.name,
      teamName: p.team,
      position: p.pos,
      gamesPlayed: p.gp,
      minutesPerGame: p.min,
      pointsPerGame: p.pts,
      reboundsPerGame: p.reb,
      assistsPerGame: p.ast,
      stealsPerGame: p.stl,
      blocksPerGame: p.blk,
      fieldGoalPct: p.fgPct,
      threePointPct: p.threePct,
      freeThrowPct: p.ftPct,
      efficiency: p.eff,
    }));

    return NextResponse.json({
      success: true,
      lnbTeamName,
      players: formatted,
      count: formatted.length,
      scrapedAt: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
