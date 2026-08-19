import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ImagePlus, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";
import { COPY_FIELDS, DEFAULT_COPY, DEFAULT_FAQS, IMAGE_SLOTS, parseFaqs, type FaqItem } from "@/lib/site-content";
import { addEditor, getEditorStatus, listEditors, restoreImage, saveCopy, saveImage } from "@/lib/site-fns";
import { SiteImage, useSite } from "@/lib/site-provider";

export const Route = createFileRoute("/studio")({ component: StudioPage });

const GROUPS = [...new Set(COPY_FIELDS.map((field) => field.group))];

async function fileToPayload(file: File, slot: string) {
  const keepPng = slot === "logo" || file.type === "image/png";
  const data = await readFile(file);
  if (keepPng && file.size < 2_400_000) {
    return { slot, mime: file.type || "image/png", data };
  }
  return { slot, mime: "image/jpeg", data: await compress(data, 1920, 0.86) };
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

function compress(src: string, maxWidth: number, quality: number) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxWidth / image.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not process photo"));
        return;
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => reject(new Error("Could not open that photo"));
    image.src = src;
  });
}

function StudioPage() {
  const { user, isPending } = useCurrentUserState();
  const { text, reload } = useSite();
  const [tab, setTab] = useState<"photos" | "words">("photos");
  const [gate, setGate] = useState<"loading" | "in" | "out">("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setGate("out");
      return;
    }
    getEditorStatus()
      .then((status) => {
        setEmail(status.email);
        setGate(status.editor ? "in" : "out");
      })
      .catch(() => setGate("out"));
  }, [isPending, user]);

  if (isPending || gate === "loading") {
    return (
      <SiteShell>
        <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="h-40 animate-pulse bg-cream/5" />
        </main>
      </SiteShell>
    );
  }

  if (!user) return <Navigate to="/login" search={{ redirect: "/studio" }} />;

  if (gate === "out") {
    return (
      <SiteShell>
        <main className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6">
          <p className="font-display text-xs tracking-[0.28em] text-gold">THE BOOTH</p>
          <h1 className="mt-3 font-display text-4xl uppercase">Editors only</h1>
          <p className="mt-4 text-sm text-muted">
            Sign in with the Google account that runs the Tribe{email ? ` (${email})` : ""}. Regular RSVP
            accounts cannot change the site.
          </p>
          <Button asChild className="mt-8">
            <Link to="/">Back to the tent</Link>
          </Button>
        </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <p className="font-display text-xs tracking-[0.28em] text-gold">THE BOOTH</p>
        <h1 className="mt-3 font-display text-5xl uppercase">Edit the site</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Swap gameday photos and rewrite any line without waiting on a rebuild. Signed-in Tribe members still
          only RSVP — this page is just for you.
        </p>
        <div className="mt-8 flex gap-2">
          {(
            [
              ["photos", "Photos"],
              ["words", "Words"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "h-11 px-5 font-display text-sm tracking-[0.16em] uppercase",
                tab === id ? "bg-garnet text-cream" : "bg-ink text-cream/80 hover:text-gold",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-8">{tab === "photos" ? <PhotoEditor onChange={reload} /> : <WordEditor initial={text} onSaved={reload} />}</div>
      </main>
    </SiteShell>
  );
}

function PhotoEditor({ onChange }: { onChange: () => Promise<void> }) {
  const [busy, setBusy] = useState<string | null>(null);

  async function replace(slot: string, file?: File) {
    if (!file) return;
    setBusy(slot);
    try {
      const payload = await fileToPayload(file, slot);
      await saveImage({ data: payload });
      await onChange();
      toast.success("Photo updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save photo");
    } finally {
      setBusy(null);
    }
  }

  async function restore(slot: string) {
    setBusy(slot);
    try {
      await restoreImage({ data: slot });
      await onChange();
      toast("Back to the original photo.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not restore");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {IMAGE_SLOTS.map((slot) => (
        <article key={slot.id} className="bg-ink p-4 shadow-[0_0_0_1px_rgba(243,230,200,0.08)]">
          <SiteImage slot={slot.id} alt={slot.label} className="h-44 w-full object-cover" />
          <h2 className="mt-4 font-display text-xl uppercase">{slot.label}</h2>
          <p className="mt-1 text-sm text-muted">{slot.hint}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <label className="inline-flex h-11 cursor-pointer items-center gap-2 bg-gold px-4 font-display text-sm tracking-[0.14em] uppercase text-night">
              <ImagePlus className="size-4" />
              {busy === slot.id ? "Saving…" : "Replace"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={busy === slot.id}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  void replace(slot.id, file);
                }}
              />
            </label>
            <Button type="button" variant="outline" onClick={() => void restore(slot.id)} disabled={busy === slot.id}>
              <RotateCcw className="size-4" />
              Original
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

function WordEditor({
  initial,
  onSaved,
}: {
  initial: (key: string) => string;
  onSaved: () => Promise<void>;
}) {
  const seed = useMemo(() => {
    const next = { ...DEFAULT_COPY };
    for (const field of COPY_FIELDS) next[field.key] = initial(field.key);
    next.faq_json = initial("faq_json") || JSON.stringify(DEFAULT_FAQS);
    return next;
  }, [initial]);
  const [copy, setCopy] = useState(seed);
  const [faqs, setFaqs] = useState<FaqItem[]>(() => parseFaqs(seed.faq_json));
  const [saving, setSaving] = useState(false);
  const [editors, setEditors] = useState<string[]>([]);
  const [newEditor, setNewEditor] = useState("");

  useEffect(() => {
    listEditors()
      .then(setEditors)
      .catch(() => setEditors([]));
  }, []);

  async function save() {
    setSaving(true);
    try {
      await saveCopy({ data: { ...copy, faq_json: JSON.stringify(faqs) } });
      await onSaved();
      toast.success("Words saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function invite() {
    try {
      await addEditor({ data: newEditor });
      setEditors((current) => [...new Set([...current, newEditor.trim().toLowerCase()])].sort());
      setNewEditor("");
      toast.success("Editor added.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add editor");
    }
  }

  return (
    <div className="space-y-10">
      {GROUPS.map((group) => (
        <section key={group}>
          <h2 className="font-display text-2xl uppercase text-gold">{group}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {COPY_FIELDS.filter((field) => field.group === group).map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1.5 block text-xs tracking-[0.14em] text-muted uppercase">{field.label}</span>
                {"multiline" in field && field.multiline ? (
                  <Textarea
                    value={copy[field.key] ?? ""}
                    onChange={(event) => setCopy((current) => ({ ...current, [field.key]: event.target.value }))}
                    rows={4}
                  />
                ) : (
                  <Input
                    value={copy[field.key] ?? ""}
                    onChange={(event) => setCopy((current) => ({ ...current, [field.key]: event.target.value }))}
                  />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}
      <section>
        <h2 className="font-display text-2xl uppercase text-gold">FAQ answers</h2>
        <div className="mt-4 space-y-4">
          {faqs.map((item, index) => (
            <div key={index} className="grid gap-3 bg-ink p-4 md:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-xs tracking-[0.14em] text-muted uppercase">Question</span>
                <Input
                  value={item.q}
                  onChange={(event) => {
                    const next = [...faqs];
                    next[index] = { ...item, q: event.target.value };
                    setFaqs(next);
                  }}
                />
              </label>
              <label>
                <span className="mb-1.5 block text-xs tracking-[0.14em] text-muted uppercase">Answer</span>
                <Textarea
                  rows={3}
                  value={item.a}
                  onChange={(event) => {
                    const next = [...faqs];
                    next[index] = { ...item, a: event.target.value };
                    setFaqs(next);
                  }}
                />
              </label>
              <button
                type="button"
                className="text-left text-xs uppercase tracking-[0.14em] text-muted hover:text-gold"
                onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => setFaqs([...faqs, { q: "", a: "" }])}>
            Add question
          </Button>
        </div>
      </section>
      <section className="bg-ink p-5">
        <h2 className="font-display text-2xl uppercase text-gold">Editors</h2>
        <p className="mt-2 text-sm text-muted">Anyone with one of these emails can open this page after they sign in.</p>
        <ul className="mt-3 space-y-1 text-sm text-cream">
          {editors.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input type="email" placeholder="new.editor@email.com" value={newEditor} onChange={(event) => setNewEditor(event.target.value)} />
          <Button type="button" variant="outline" onClick={() => void invite()}>
            Add editor
          </Button>
        </div>
      </section>
      <div className="sticky bottom-4 flex justify-end">
        <Button type="button" size="lg" onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save words"}
        </Button>
      </div>
    </div>
  );
}
