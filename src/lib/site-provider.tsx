import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_COPY, IMAGE_SLOTS } from "@/lib/site-content";
import { getSiteContent } from "@/lib/site-fns";

type SiteState = {
  ready: boolean;
  text: (key: string) => string;
  imageSrc: (slot: string) => string;
  reload: () => Promise<void>;
};

const SiteContext = createContext<SiteState | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [copy, setCopy] = useState<Record<string, string>>(DEFAULT_COPY);
  const [images, setImages] = useState<Record<string, string>>({});

  const reload = useCallback(async () => {
    try {
      const next = await getSiteContent();
      setCopy({ ...DEFAULT_COPY, ...next.copy });
      setImages(next.images);
    } catch {
      setCopy(DEFAULT_COPY);
      setImages({});
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo<SiteState>(
    () => ({
      ready: true,
      text: (key) => copy[key] ?? DEFAULT_COPY[key] ?? "",
      imageSrc: (slot) => {
        const version = images[slot];
        if (version) return `/api/media/${slot}?v=${encodeURIComponent(version)}`;
        return IMAGE_SLOTS.find((item) => item.id === slot)?.fallback ?? "";
      },
      reload,
    }),
    [copy, images, reload],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return (
    useContext(SiteContext) ?? {
      ready: false,
      text: (key: string) => DEFAULT_COPY[key] ?? "",
      imageSrc: (slot: string) => IMAGE_SLOTS.find((item) => item.id === slot)?.fallback ?? "",
      reload: async () => undefined,
    }
  );
}

export function SiteImage({
  slot,
  alt,
  className,
}: {
  slot: string;
  alt: string;
  className?: string;
}) {
  const { imageSrc } = useSite();
  return <img src={imageSrc(slot)} alt={alt} className={className} />;
}
