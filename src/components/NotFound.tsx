import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-bg px-6 text-center text-fg">
      <p className="kicker">Lost on gameday</p>
      <h1 className="font-display text-5xl uppercase text-cream">Page not found</h1>
      <p className="max-w-md text-muted">
        That route wandered off toward Gainesville. Let’s get you back to the tent.
      </p>
      <Button asChild>
        <Link to="/">Back home</Link>
      </Button>
    </main>
  );
}
