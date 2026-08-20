import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { PACKING } from "@/data/site";
import { cn } from "@/lib/utils";

const KEY = "tt-pack";

export function PackingList() {
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setChecked(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <ul className="space-y-2">
      {PACKING.map((item) => {
        const on = checked.includes(item.id);
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition-[border-color,background-color] duration-150",
                on
                  ? "border-gold bg-garnet-dark/60 text-cream"
                  : "border-border bg-surface text-cream hover:border-gold/60",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-sm border transition-colors duration-150",
                  on ? "border-gold bg-gold text-ink" : "border-gold/50 text-transparent",
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <span className="text-sm sm:text-base">{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
