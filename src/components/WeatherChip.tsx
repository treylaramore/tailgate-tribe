import { useEffect, useState } from "react";
import { CloudSun } from "lucide-react";
import { SITE } from "@/data/site";
import { Button } from "@/components/ui/button";

type Daily = {
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
};

export function WeatherChip({ date }: { date: string }) {
  const [label, setLabel] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function load() {
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${SITE.location.lat}&longitude=${SITE.location.lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=America%2FNew_York&start_date=${date}&end_date=${date}`,
      );
      if (!res.ok) throw new Error("forecast unavailable");
      const json = (await res.json()) as { daily?: Daily };
      const daily = json.daily;
      if (!daily?.temperature_2m_max?.length) throw new Error("no data");
      const high = Math.round(daily.temperature_2m_max[0] ?? 0);
      const low = Math.round(daily.temperature_2m_min[0] ?? 0);
      const rain = daily.precipitation_probability_max[0] ?? 0;
      const pretty = new Date(`${date}T12:00:00-04:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "America/New_York",
      });
      setLabel(
        `${pretty} · Tallahassee · ${high}° / ${low}°${rain >= 30 ? ` · ${rain}% rain` : ""}`,
      );
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  if (label) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full border border-border bg-ink/40 px-3 py-1.5 text-sm text-cream">
        <CloudSun className="size-4 text-gold" />
        {label}
      </p>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => void load()}
      disabled={busy}
      className="h-9 border border-border"
    >
      <CloudSun className="size-4 text-gold" />
      {busy ? "Checking…" : failed ? "Forecast unavailable — try again" : "Tallahassee forecast"}
    </Button>
  );
}
