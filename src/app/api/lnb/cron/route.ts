import { NextResponse } from "next/server";
import { Timestamp } from "firebase/firestore";

const LNB_STATS_URL = "https://lnbchile.com/liga/uno/stats";

function parseNumber(val: string): number {
  const cleaned = val.replace(/[^0-9.,-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

async function scrapeTeam(lnbTeamName: string) {
  const response = await fetch(LNB_STATS_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TOALESCO/1.0)" },
  });
  if (!response.ok) return { team: lnbTeamName, count: 0, error: `HTTP ${response.status}` };
  const html = await response.text();
  const cheerio = await import("cheerio");
  const $ = cheerio.load(html);
  const players: any[] = [];
  $("table tbody tr, .stats-table tbody tr, .table tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 10) return;
    const name = $(cells[0]).text().trim();
    const team = $(cells[1]).text().trim();
    if (!name || team.toLowerCase() !== lnbTeamName.toLowerCase()) return;
    players.push({
      playerName: name,
      teamName: team,
      position: $(cells[2]).text().trim(),
      gamesPlayed: parseNumber($(cells[3]).text()),
      minutesPerGame: parseNumber($(cells[4]).text()),
      pointsPerGame: parseNumber($(cells[5]).text()),
      reboundsPerGame: parseNumber($(cells[6]).text()),
      assistsPerGame: parseNumber($(cells[7]).text()),
      stealsPerGame: parseNumber($(cells[8]).text()),
      blocksPerGame: parseNumber($(cells[9]).text()),
      fieldGoalPct: parseNumber($(cells[10])?.text() ?? "0"),
      threePointPct: parseNumber($(cells[11])?.text() ?? "0"),
      freeThrowPct: parseNumber($(cells[12])?.text() ?? "0"),
      efficiency: parseNumber($(cells[13])?.text() ?? "0"),
    });
  });
  return { team: lnbTeamName, count: players.length, players, error: null };
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { db } = await import("@/lib/firebase/client");
    if (!db) return NextResponse.json({ error: "Firestore no disponible" }, { status: 500 });

    const { collection, getDocs, query, where, writeBatch, doc } = await import("firebase/firestore");

    const clubsSnap = await getDocs(query(collection(db, "clubs"), where("lnbTeamName", "!=", "")));
    const results: any[] = [];

    for (const clubDoc of clubsSnap.docs) {
      const clubData = clubDoc.data();
      const lnbTeamName = clubData.lnbTeamName;
      if (!lnbTeamName) continue;

      const result = await scrapeTeam(lnbTeamName);
      results.push(result);

      if (result.players && result.players.length > 0) {
        const batch = writeBatch(db);
        const existing = await getDocs(query(collection(db, "lnb_stats"), where("clubId", "==", clubDoc.id)));
        existing.forEach((d) => batch.delete(d.ref));
        for (const p of result.players) {
          batch.set(doc(collection(db, "lnb_stats")), { ...p, clubId: clubDoc.id, scrapedAt: Timestamp.now() });
        }
        await batch.commit();
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
