import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listShoutouts, postShoutout, type Shoutout } from "@/lib/shoutout-fns";

export function ShoutoutWall({ limit }: { limit?: number }) {
  const { user, isPending } = useCurrentUserState();
  const [items, setItems] = useState<Shoutout[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setItems(await listShoutouts());
  }

  useEffect(() => {
    refresh().catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (user?.displayName && !displayName) setDisplayName(user.displayName);
  }, [user?.displayName, displayName]);

  async function onPost() {
    setBusy(true);
    try {
      await postShoutout({ data: { displayName, message } });
      setMessage("");
      toast.success("Shout posted.");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not post");
    } finally {
      setBusy(false);
    }
  }

  const visible = limit ? items.slice(0, limit) : items;

  return (
    <div className="space-y-5">
      {isPending ? (
        <div className="h-28 animate-pulse bg-cream/5" />
      ) : user ? (
        <form
          className="space-y-3 bg-night p-4 shadow-[0_0_0_1px_rgba(243,230,200,0.08)]"
          onSubmit={(event) => {
            event.preventDefault();
            void onPost();
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-[11px] tracking-[0.16em] text-muted uppercase">Name</span>
            <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={40} required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] tracking-[0.16em] text-muted uppercase">Gameday shout</span>
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={180}
              required
              placeholder="FSU by two scores. Save me a chair."
            />
          </label>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted">{180 - message.length} left</p>
            <Button type="submit" disabled={busy}>
              Post it
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-night p-4 shadow-[0_0_0_1px_rgba(243,230,200,0.08)]">
          <p className="text-sm text-cream">Sign in to leave a shout for the crew.</p>
          <Button asChild className="mt-3" variant="outline">
            <Link to="/login" search={{ redirect: "/tribe" }}>
              Sign in
            </Link>
          </Button>
        </div>
      )}
      {visible.length === 0 ? (
        <p className="text-sm text-muted">No shouts yet. Be the first Nole on the wall.</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id} className="bg-night px-4 py-3 shadow-[0_0_0_1px_rgba(243,230,200,0.08)]">
              <p className="font-display text-xs tracking-[0.18em] text-gold uppercase">{item.displayName}</p>
              <p className="mt-1.5 text-cream">{item.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
