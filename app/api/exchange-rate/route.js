const FALLBACK_USD_CNY = 6.79;

export async function GET() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Exchange API returned ${response.status}`);
    }

    const payload = await response.json();
    const rate = Number(payload?.rates?.CNY);

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("Exchange API did not return a valid CNY rate");
    }

    return Response.json({
      base: "USD",
      target: "CNY",
      rate,
      updatedAt: payload.time_last_update_utc,
      nextUpdateAt: payload.time_next_update_utc,
      fallback: false,
      source: "open.er-api.com"
    });
  } catch (error) {
    return Response.json({
      base: "USD",
      target: "CNY",
      rate: FALLBACK_USD_CNY,
      updatedAt: null,
      nextUpdateAt: null,
      fallback: true,
      source: "fallback",
      message: error instanceof Error ? error.message : "Unknown exchange rate error"
    });
  }
}
