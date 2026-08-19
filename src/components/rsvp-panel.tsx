import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { TribeEvent } from "@/lib/events";
import { cancelRsvp, listEventRsvps, listMyRsvps, saveRsvp } from "@/lib/rsvp-fns";
import { useSite } from "@/lib/site-provider";

const BRINGING = ["Drinks", "Chair", "Dessert", "Wings", "Just me"];

type Listed = { displayName: string; partySize: number; bringing: string };

export function RsvpPanel({ event, compact = false }: { event: TribeEvent; compact?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  const { text } = useSite();
  const [list, setList] = useState<Listed[]>([]);
  const [mine, setMine] = useState<Listed | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [bringing, setBringing] = useState("");
  const [busy, setBusy] = useState(false);
  const heads = list.reduce((sum, row) => sum + row.partySize, 0);

  async function refresh() {
    const next = await listEventRsvps({ data: event.id });
    setList(next);
    if (user) {
      try {
        const mineRow = (await listMyRsvps()).find((row) => row.eventId === event.id) ?? null;
        setMine(mineRow);
        if (mineRow) {
          setDisplayName(mineRow.displayName);
          setPartySize(mineRow.partySize);
          setBringing(mineRow.bringing);
        }
      } catch {
        setMine(null);
      }
    } else {
      setMine(null);
    }
  }

  useEffect(() => {
    if (isPending) return;
    refresh().catch(() => setList([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id, user?.id, isPending]);

  useEffect(() => {
    if (user?.displayName && !displayName) setDisplayName(user.displayName);
  }, [user?.displayName, displayName]);

  async function onSave() {
    setBusy(true);
    try {
      await saveRsvp({ data: { eventId: event.id, displayName, partySize, bringing } });
      toast.success(mine ? "RSVP updated." : "You're on the list. See you at the tent.");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save RSVP");
    } finally {
      setBusy(false);
    }
  }

  async function onCancel() {
    setBusy(true);
    try {
      await cancelRsvp({ data: event.id });
      toast("Pulled your RSVP.");
      setMine(null);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel");
    } finally {
      setBusy(false);
    }
  }

  if (!event.hasTribe) {
    return <p className="text-sm text-muted">No Tribe tent this week. Catch the Noles wherever you are.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.22em] text-gold">{text("rsvp_who")}</p>
          <p className="mt-1 font-display text-3xl uppercase text-cream">
            {heads} {heads === 1 ? "head" : "heads"} counted
          </p>
        </div>
        <p className="text-sm text-muted">{list.length} parties</p>
      </div>
      {isPending ? (
        <div className="h-36 animate-pulse bg-cream/5" />
      ) : user ? (
        <form
          className="space-y-3 bg-night p-4 shadow-[0_0_0_1px_rgba(243,230,200,0.08)]"
          onSubmit={(event) => {
            event.preventDefault();
            void onSave();
          }}
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_88px]">
            <label className="block">
              <span className="mb-1.5 block text-[11px] tracking-[0.16em] text-muted uppercase">Name on the list</span>
              <Input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={40}
                required
                placeholder="What should we call you?"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] tracking-[0.16em] text-muted uppercase">Heads</span>
              <Input
                type="number"
                min={1}
                max={12}
                value={partySize}
                onChange={(event) => setPartySize(Number(event.target.value))}
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[11px] tracking-[0.16em] text-muted uppercase">Bringing</span>
            <Input
              value={bringing}
              onChange={(event) => setBringing(event.target.value)}
              maxLength={80}
              placeholder="Drinks, a chair, dessert…"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {BRINGING.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setBringing(item)}
                className="h-8 px-3 text-xs tracking-[0.08em] text-cream shadow-[0_0_0_1px_rgba(243,230,200,0.16)] hover:text-gold"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="submit" disabled={busy}>
              {mine ? "Update RSVP" : "I'm in"}
            </Button>
            {mine ? (
              <Button type="button" variant="outline" disabled={busy} onClick={() => void onCancel()}>
                Can't make it
              </Button>
            ) : null}
          </div>
        </form>
      ) : (
        <div className="bg-night p-4 shadow-[0_0_0_1px_rgba(243,230,200,0.08)]">
          <p className="text-sm text-cream">Sign in to put your name on the list so we can plan food and chairs.</p>
          <Button asChild className="mt-3">
            <Link to="/login" search={{ redirect: `/schedule/${event.id}` }}>
              Sign in to RSVP
            </Link>
          </Button>
        </div>
      )}
      {!compact && list.length > 0 ? (
        <ul className="divide-y divide-gold/15">
          {list.map((row, index) => (
            <li key={`${row.displayName}-${index}`} className="flex items-start justify-between gap-4 py-3">
              <div>
                <p className="font-medium text-cream">{row.displayName}</p>
                {row.bringing ? <p className="text-sm text-muted">Bringing {row.bringing}</p> : null}
              </div>
              <p className="font-display text-sm tracking-[0.12em] text-gold">×{row.partySize}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
