import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type PictureItem = {
  id: string;
  src: string;
  label: string;
};

const MAX_PICTURES = 80;
const STORAGE_KEY = "usha-legacy-pictures-v1";

const readStoredPictures = (): PictureItem[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as PictureItem[];
    return parsed.filter((item) => item.id && item.src).slice(0, MAX_PICTURES);
  } catch {
    return [];
  }
};

const reorder = (list: PictureItem[], fromId: string, toId: string) => {
  if (fromId === toId) return list;
  const fromIndex = list.findIndex((x) => x.id === fromId);
  const toIndex = list.findIndex((x) => x.id === toId);
  if (fromIndex < 0 || toIndex < 0) return list;
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

const Pictures = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pictures, setPictures] = useState<PictureItem[]>(() => readStoredPictures());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [presentMode, setPresentMode] = useState(false);
  const [presentIndex, setPresentIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pictures));
  }, [pictures]);

  useEffect(() => {
    if (!presentMode) return;
    const root = document.documentElement;
    void root.requestFullscreen?.();
    return () => {
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      }
    };
  }, [presentMode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!presentMode) return;
      if (event.key === "Escape") {
        setPresentMode(false);
        return;
      }
      if (event.key === "ArrowRight") {
        setPresentIndex((idx) => Math.min(idx + 1, pictures.length - 1));
      }
      if (event.key === "ArrowLeft") {
        setPresentIndex((idx) => Math.max(idx - 1, 0));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [presentMode, pictures.length]);

  const uploadCount = useMemo(() => Math.max(0, MAX_PICTURES - pictures.length), [pictures.length]);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const incoming = Array.from(files).slice(0, uploadCount);
    const reads = incoming.map(
      (file, index) =>
        new Promise<PictureItem>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: crypto.randomUUID(),
              src: String(reader.result),
              label: file.name.replace(/\.[^.]+$/, "") || `Picture ${pictures.length + index + 1}`,
            });
          };
          reader.readAsDataURL(file);
        }),
    );
    const loaded = await Promise.all(reads);
    setPictures((prev) => [...prev, ...loaded].slice(0, MAX_PICTURES));
  };

  const updateLabel = (id: string, label: string) => {
    setPictures((prev) => prev.map((item) => (item.id === id ? { ...item, label } : item)));
  };

  const current = pictures[presentIndex];

  return (
    <main className="min-h-screen bg-background text-foreground p-6 overflow-auto">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="smallcaps text-[0.65rem] border border-foreground/30 px-2 py-1 hover:bg-foreground/10 transition-colors"
          >
            Back
          </button>
          <div className="smallcaps text-[0.7rem]">Pictures</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadCount === 0}
            className="smallcaps text-[0.65rem] border border-foreground/30 px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Upload ({pictures.length}/{MAX_PICTURES})
          </button>
          <button
            type="button"
            onClick={() => {
              if (!pictures.length) return;
              setPresentIndex(0);
              setPresentMode(true);
            }}
            disabled={!pictures.length}
            className="smallcaps text-[0.65rem] border border-foreground/30 px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Present
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            void onUpload(event.target.files);
            event.currentTarget.value = "";
          }}
        />
      </header>

      <p className="text-sm text-foreground/65 mb-4">
        Upload up to {MAX_PICTURES} pictures, drag and drop cards to reorder, and edit labels inline.
      </p>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
        {pictures.map((picture, index) => (
          <article
            key={picture.id}
            draggable
            onDragStart={() => setDraggingId(picture.id)}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (!draggingId) return;
              setPictures((prev) => reorder(prev, draggingId, picture.id));
            }}
            className="border border-border bg-card p-3 rounded-sm"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img src={picture.src} alt={picture.label || `Picture ${index + 1}`} className="w-full h-full object-cover" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="smallcaps text-[0.6rem] text-foreground/60">{String(index + 1).padStart(2, "0")}</span>
              <input
                value={picture.label}
                onChange={(event) => updateLabel(picture.id, event.target.value)}
                className="w-full border border-input bg-background px-2 py-1 text-sm"
                placeholder={`Picture ${index + 1}`}
              />
            </div>
          </article>
        ))}
      </section>

      {presentMode && current && (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <div className="smallcaps text-[0.65rem]">{current.label || `Picture ${presentIndex + 1}`}</div>
            <button
              type="button"
              onClick={() => setPresentMode(false)}
              className="smallcaps text-[0.65rem] border border-white/40 px-2 py-1"
            >
              Exit
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center px-6 pb-6">
            <button
              type="button"
              onClick={() => setPresentIndex((idx) => Math.max(idx - 1, 0))}
              disabled={presentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 border border-white/40 rounded-full disabled:opacity-40"
            >
              ‹
            </button>
            <img src={current.src} alt={current.label || `Picture ${presentIndex + 1}`} className="max-h-full max-w-full object-contain" />
            <button
              type="button"
              onClick={() => setPresentIndex((idx) => Math.min(idx + 1, pictures.length - 1))}
              disabled={presentIndex === pictures.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 border border-white/40 rounded-full disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Pictures;
