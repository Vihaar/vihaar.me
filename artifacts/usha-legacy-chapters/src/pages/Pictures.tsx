import JSZip from "jszip";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type PictureItem = {
  id: string;
  src: string;
  label: string;
  fileName: string;
};
type PersistedPictureState = {
  labels: Record<string, string>;
  order: string[];
};

const MAX_PICTURES = 80;
const STORAGE_KEY = "usha-legacy-pictures-v2";
const PICTURES_DIR = "usha-pictures";
const LABELS_URL = `${import.meta.env.BASE_URL}${PICTURES_DIR}/labels.json`;
const LABELS_SAVE_ENDPOINT = "/__admin/picture-labels";
const DUPLICATE_FILE_NAMES = new Set([
  "WhatsApp_Image_2026-05-04_at_21.59.37-d2a5d840-eb5d-4872-bf50-1441c57a4879.png",
  "WhatsApp_Image_2026-05-04_at_22.20.23__1_-6d6de9ea-cb16-4bcc-99de-1d1b6957bbcd.png",
]);
const DOCUMENT_FILES = [
  "documents/PD DOC usha2.docx",
  "documents/Usha Nandigala and Family.xlsx - Sheet1.csv",
] as const;
const SOURCE_FILES = [
  "WhatsApp_Image_2026-05-04_at_21.54.45-0d06be4d-4d31-4dce-be76-78b4275fa2ce.png",
  "WhatsApp_Image_2026-05-04_at_21.54.45__1_-5ff77a77-fbb0-4386-a6d5-9c02da08181e.png",
  "WhatsApp_Image_2026-05-04_at_21.54.45__2_-0f8c7432-6a44-4856-a4a9-f598211e8f1a.png",
  "WhatsApp_Image_2026-05-04_at_21.54.45__3_-deea7310-c748-415d-a634-79dcc104652e.png",
  "WhatsApp_Image_2026-05-04_at_21.54.46-d5e8f569-5d6b-4908-8ab9-0a37af39b217.png",
  "WhatsApp_Image_2026-05-04_at_21.55.20-1cad098a-904c-4390-bd44-53cbcfb20f87.png",
  "WhatsApp_Image_2026-05-04_at_21.55.20__1_-0a4bbb52-f15b-4f66-bcb2-ba976f51b66b.png",
  "WhatsApp_Image_2026-05-04_at_21.55.20__2_-22faffd3-3a45-4dae-b828-19d44d0c602b.png",
  "WhatsApp_Image_2026-05-04_at_21.55.20__3_-f6e9f1e2-f23d-4983-9408-9ba23ca2902c.png",
  "WhatsApp_Image_2026-05-04_at_21.55.20__4_-0282af8b-82da-44c5-aae6-8d034d41049c.png",
  "WhatsApp_Image_2026-05-04_at_21.55.21-bedfe89b-cbac-47bd-add2-aabb896c5e30.png",
  "WhatsApp_Image_2026-05-04_at_21.55.21__1_-65faf0bb-aa78-443f-b70b-a20b0fad1ad8.png",
  "WhatsApp_Image_2026-05-04_at_21.55.21__2_-c119cb3b-b6b6-4e17-82a3-0f45705ed1c4.png",
  "WhatsApp_Image_2026-05-04_at_21.55.21__3_-c936bcb1-c32f-4cb4-baf7-89d2d6aae83c.png",
  "WhatsApp_Image_2026-05-04_at_21.55.21__4_-38138e95-8708-4f30-a9ec-39782e79fc51.png",
  "WhatsApp_Image_2026-05-04_at_21.55.22-90dc186d-aca5-40b1-9c40-81109abadb3d.png",
  "WhatsApp_Image_2026-05-04_at_21.55.22__1_-24fd8277-0d8c-45e1-9486-992e6972f44f.png",
  "WhatsApp_Image_2026-05-04_at_21.55.22__2_-5ae818cc-3189-4c8b-8d36-f37e8a174a27.png",
  "WhatsApp_Image_2026-05-04_at_21.55.22__3_-7d0c0d03-a08a-4e9a-976c-f962eaff13bb.png",
  "WhatsApp_Image_2026-05-04_at_21.55.22__4_-cc0f06b7-9120-4a1c-85f4-868e15cde669.png",
  "WhatsApp_Image_2026-05-04_at_21.55.22__5_-5bceb7db-45ba-4034-9657-0aa9321364f7.png",
  "WhatsApp_Image_2026-05-04_at_21.55.23-bfd52895-1c4c-4adb-bee0-1c595252cbf3.png",
  "WhatsApp_Image_2026-05-04_at_21.55.23__1_-52797777-8c45-4992-a377-9a268c4a550b.png",
  "WhatsApp_Image_2026-05-04_at_21.55.23__2_-c3601f72-d49a-4a22-baff-fd9a0c9430ad.png",
  "WhatsApp_Image_2026-05-04_at_21.57.21-97b853d7-c8c6-4c66-b0dc-93c1f953f5f0.png",
  "WhatsApp_Image_2026-05-04_at_21.57.22-cac0d907-f71d-40f1-af1c-be890e266b5e.png",
  "WhatsApp_Image_2026-05-04_at_21.57.25-f4a7b153-b00b-4bd2-85bf-b847195ebe7a.png",
  "WhatsApp_Image_2026-05-04_at_21.57.25__1_-dff51b90-a5ac-4622-8e79-5ee6ba7dfd22.png",
  "WhatsApp_Image_2026-05-04_at_21.58.49-0f966425-ba18-4c79-aac7-da77a19ccebb.png",
  "WhatsApp_Image_2026-05-04_at_21.59.37-d2a5d840-eb5d-4872-bf50-1441c57a4879.png",
  "WhatsApp_Image_2026-05-04_at_22.00.32-8e189a58-406d-4cb3-aa02-3c511c0e89f1.png",
  "WhatsApp_Image_2026-05-04_at_22.03.23-22674942-0f86-4a40-9aaf-780ca7c70aa2.png",
  "WhatsApp_Image_2026-05-04_at_22.08.06-3ff2402f-b2b7-4719-9014-ce69fff65f18.png",
  "WhatsApp_Image_2026-05-04_at_22.11.42-a4431dbd-d60b-448f-88b9-a66bb0f61e40.png",
  "WhatsApp_Image_2026-05-04_at_22.14.40-be2c40ec-9b66-4e01-81de-9c45e5254c0f.png",
  "WhatsApp_Image_2026-05-04_at_22.15.13-8409f5d6-59cb-4122-86f6-3928a31e8ddc.png",
  "WhatsApp_Image_2026-05-04_at_22.15.37-355cab12-bdd7-44cd-99f8-21289903d7ce.png",
  "WhatsApp_Image_2026-05-04_at_22.16.19-96f83fad-06ed-4d0b-8348-c821f54260b0.png",
  "WhatsApp_Image_2026-05-04_at_22.17.21-ad9ae594-0412-4bd6-b472-9f8afc97b02d.png",
  "WhatsApp_Image_2026-05-04_at_22.18.41-97390782-afa1-4200-a8b3-023a1d7a6132.png",
  "WhatsApp_Image_2026-05-04_at_22.19.12-cee90f3b-7a88-4363-a941-4dcb051ce204.png",
  "WhatsApp_Image_2026-05-04_at_22.19.41-f3e259e0-6b0a-484b-b46a-dabbc301337d.png",
  "WhatsApp_Image_2026-05-04_at_22.20.01-fa6805ac-5121-4448-b7dd-9b4a2d415fe8.png",
  "WhatsApp_Image_2026-05-04_at_22.20.23-d40b6984-e876-4c43-8d0d-05f4d3172a76.png",
  "WhatsApp_Image_2026-05-04_at_22.20.23__1_-6d6de9ea-cb16-4bcc-99de-1d1b6957bbcd.png",
  "WhatsApp_Image_2026-05-04_at_22.20.58-61cb2cbb-6ad9-497d-ad87-5acb8d6c3373.png",
  "WhatsApp_Image_2026-05-04_at_22.21.26-2c6f5697-bcb0-4ea2-a870-eb0b63630412.png",
  "WhatsApp_Image_2026-05-04_at_22.21.58-fbd61961-5994-422a-8e38-c94bd171f3c5.png",
  "WhatsApp_Image_2026-05-04_at_22.22.22-cfc1ab75-9a22-47f3-9981-1a9f423f318a.png",
  "WhatsApp_Image_2026-05-04_at_22.22.52-ef4d939c-3067-4b3a-9efd-80bf18f69f23.png",
  "WhatsApp_Image_2026-05-04_at_22.23.15-a1d395b0-c6d7-44d7-af34-19d6c52a91a8.png",
  "WhatsApp_Image_2026-05-04_at_22.23.43-77d82638-1144-40a7-bf1a-f5514a63271d.png",
  "WhatsApp_Image_2026-05-04_at_22.24.05-15a6b5fa-04a9-4386-8f08-49e09b969873.png",
  "WhatsApp_Image_2026-05-04_at_22.24.31-535b172f-371b-4430-820e-ad2a7784e06a.png",
  "WhatsApp_Image_2026-05-04_at_22.25.20-4fd5963e-abc2-4530-a0db-a301e41ee4b0.png",
  "WhatsApp_Image_2026-05-04_at_22.27.44-f800136d-2b68-4ea1-a10b-7051edd4eabf.png",
  "WhatsApp_Image_2026-05-04_at_22.30.14-16f3a79d-5f10-4789-a7d1-90b5291114ca.png",
  "WhatsApp_Image_2026-05-04_at_22.31.46-38e4e667-6bf0-4956-a95a-e777e8a8a7be.png",
  "WhatsApp_Image_2026-05-04_at_22.32.57-b624c447-1d56-43ce-995e-1fada4feb27b.png",
  "WhatsApp_Image_2026-05-04_at_22.33.15-c8c76c51-f5a3-45a7-9b64-321928c0dc10.png",
  "WhatsApp_Image_2026-05-04_at_22.34.20-65a6d30f-0226-46de-ae58-d55521366909.png",
  "WhatsApp_Image_2026-05-04_at_22.35.07-f150a99e-222b-4a1d-bed5-63d321f35324.png",
  "WhatsApp_Image_2026-05-04_at_22.36.22-061dddef-7b4f-4d4f-aa46-54a98e6241bf.png",
  "WhatsApp_Image_2026-05-04_at_22.38.27-60ba0342-62b9-4983-b56e-4329fd6a0878.png",
  "WhatsApp_Image_2026-05-04_at_22.52.27-12eabd0b-7f76-461c-ba83-bc0223a4652d.png",
  "WhatsApp_Image_2026-05-04_at_22.55.47-bef84519-810b-4479-877d-ffce00c15173.png",
  "WhatsApp_Image_2026-05-04_at_22.59.07-1a5c1b34-034c-4e1f-ab13-0088c3a30590.png",
  "WhatsApp_Image_2026-05-05_at_05.23.04-60756656-b7b2-4d5b-acaf-5208cd6b057c.png",
  "WhatsApp_Image_2026-05-05_at_05.49.09-55389130-079e-46cc-8146-fde6c9185740.png",
  "WhatsApp_Image_2026-05-05_at_05.57.44-7e5cd407-5f5d-431d-b490-3102aabd5709.png",
  "WhatsApp_Image_2026-05-05_at_05.58.33-030e2036-9bbb-4101-b289-2a4ea43dc11c.png",
  "WhatsApp_Image_2026-05-05_at_05.58.33__1_-168586fe-d17f-43a1-8cae-b3ad10b44f30.png",
  "WhatsApp_Image_2026-05-05_at_05.59.19-256ff9eb-0398-439d-a8d7-0c6052259586.png",
  "WhatsApp_Image_2026-05-05_at_06.01.12-fc65f5ee-c442-4f2d-8735-7587e29d3cc8.png",
  "WhatsApp_Image_2026-05-05_at_06.29.54-31b1bc5a-014e-45c0-ad82-6f23a55f29af.png",
  "WhatsApp_Image_2026-05-05_at_06.31.05-c671c8b4-4056-4128-8994-413e53753f90.png",
  "WhatsApp_Image_2026-05-05_at_06.33.18-78ca44cf-41c4-4605-8c3d-8aeaa713b287.png",
  "WhatsApp_Image_2026-05-05_at_06.33.43-1c5c41f2-cbe4-49b7-89c2-7a70eb67c825.png",
  "WhatsApp_Image_2026-05-05_at_06.50.14-f2619e35-f9f9-4029-b245-08f984821541.png",
] as const;

const toPictureUrl = (fileName: string) =>
  `${import.meta.env.BASE_URL}${PICTURES_DIR}/${encodeURIComponent(fileName)}`;
const toRepoAssetUrl = (relativePath: string) =>
  `${import.meta.env.BASE_URL}${PICTURES_DIR}/${relativePath.split("/").map(encodeURIComponent).join("/")}`;

const CONTEXT_SECTIONS = [
  "Roots and Early Life",
  "School and Leadership",
  "Marriage and Move to US",
  "Career Growth",
  "Family and Children",
  "Caregiving and Resilience",
  "Investing and Ownership",
  "US and India Assets",
  "Legacy and Purpose",
];

const OCR_HINT_LABELS: Record<string, string> = {
  "WhatsApp_Image_2026-05-05_at_06.50.14-f2619e35-f9f9-4029-b245-08f984821541.png": "Tiger 21 Meeting Agenda",
  "WhatsApp_Image_2026-05-05_at_05.58.33__1_-168586fe-d17f-43a1-8cae-b3ad10b44f30.png": "Shri Laxmi Narasimha Reddy Nandigala",
  "WhatsApp_Image_2026-05-05_at_06.01.12-fc65f5ee-c442-4f2d-8735-7587e29d3cc8.png": "Living Isha Reflection",
};

const isFileNameLikeLabel = (label: string) =>
  label.includes("WhatsApp_Image_") || label.length > 55 || label.toLowerCase().includes("realme");

const getContextLabel = (fileName: string, index: number) => {
  const ocrHint = OCR_HINT_LABELS[fileName];
  if (ocrHint) return ocrHint;
  const section = CONTEXT_SECTIONS[Math.min(Math.floor(index / 9), CONTEXT_SECTIONS.length - 1)];
  return `${section} · Picture ${String(index + 1).padStart(2, "0")}`;
};

const sourcePictures: PictureItem[] = SOURCE_FILES
  .filter((fileName) => !DUPLICATE_FILE_NAMES.has(fileName))
  .slice(0, MAX_PICTURES)
  .map((fileName, index) => ({
    id: fileName,
    src: toPictureUrl(fileName),
    label: getContextLabel(fileName, index),
    fileName,
  }));

type SortablePictureCardProps = {
  picture: PictureItem;
  index: number;
  onLabelChange: (id: string, label: string) => void;
};

const SortablePictureCard = ({ picture, index, onLabelChange }: SortablePictureCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: picture.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`border border-border bg-card p-3 rounded-sm cursor-grab active:cursor-grabbing touch-none ${isDragging ? "z-20 shadow-xl ring-2 ring-foreground/25" : ""}`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img src={picture.src} alt={picture.label || `Picture ${index + 1}`} className="w-full h-full object-cover select-none" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="smallcaps text-[0.6rem] text-foreground/60">{String(index + 1).padStart(2, "0")}</span>
        <input
          value={picture.label}
          onChange={(event) => onLabelChange(picture.id, event.target.value)}
          onPointerDownCapture={(event) => event.stopPropagation()}
          className="w-full border border-input bg-background px-2 py-1 text-sm"
          placeholder={`Picture ${index + 1}`}
        />
      </div>
    </article>
  );
};

const readStoredPictures = (): PictureItem[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return sourcePictures;
  try {
    const parsed = JSON.parse(raw) as Array<Pick<PictureItem, "fileName" | "label">>;
    const lookup = new Map(sourcePictures.map((item) => [item.fileName, item]));
    const ordered: PictureItem[] = [];
    parsed.forEach((saved) => {
      const match = lookup.get(saved.fileName);
      if (!match) return;
      lookup.delete(saved.fileName);
      const safeLabel = !saved.label || isFileNameLikeLabel(saved.label) ? match.label : saved.label;
      ordered.push({ ...match, label: safeLabel });
    });
    lookup.forEach((leftover) => ordered.push(leftover));
    return ordered.slice(0, MAX_PICTURES);
  } catch {
    return sourcePictures;
  }
};

const toLabelsMap = (items: PictureItem[]) =>
  Object.fromEntries(items.map((item) => [item.fileName, item.label]));
const toOrderList = (items: PictureItem[]) => items.map((item) => item.fileName);
const normalizePersistedState = (payload: unknown): PersistedPictureState => {
  if (!payload || typeof payload !== "object") {
    return { labels: {}, order: [] };
  }

  // Backward compatibility with old format: { "<fileName>": "<label>" }
  const legacyEntries = Object.entries(payload as Record<string, unknown>).filter(([, value]) => typeof value === "string");
  const legacyLabels = Object.fromEntries(legacyEntries) as Record<string, string>;

  const parsed = payload as { labels?: unknown; order?: unknown };
  const labels =
    parsed.labels && typeof parsed.labels === "object"
      ? Object.fromEntries(Object.entries(parsed.labels as Record<string, unknown>).filter(([, value]) => typeof value === "string"))
      : legacyLabels;
  const order = Array.isArray(parsed.order) ? parsed.order.filter((value): value is string => typeof value === "string") : [];

  return { labels, order };
};

const Pictures = () => {
  const navigate = useNavigate();
  const [pictures, setPictures] = useState<PictureItem[]>(() => readStoredPictures());
  const [presentMode, setPresentMode] = useState(false);
  const [presentIndex, setPresentIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const hasHydratedLabels = useRef(false);

  useEffect(() => {
    const payload = pictures.map((item) => ({ fileName: item.fileName, label: item.label }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [pictures]);

  useEffect(() => {
    let alive = true;
    const loadLabels = async () => {
      try {
        const response = await fetch(LABELS_URL, { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as unknown;
        if (!alive) return;
        const { labels, order } = normalizePersistedState(payload);
        setPictures((prev) => {
          const withLabels = prev.map((item) => {
            const saved = labels[item.fileName];
            return saved && saved.trim().length > 0 ? { ...item, label: saved } : item;
          });

          if (!order.length) return withLabels;
          const lookup = new Map(withLabels.map((item) => [item.fileName, item]));
          const ordered: PictureItem[] = [];
          order.forEach((fileName) => {
            const match = lookup.get(fileName);
            if (!match) return;
            ordered.push(match);
            lookup.delete(fileName);
          });
          lookup.forEach((item) => ordered.push(item));
          return ordered;
        });
      } catch {
        // Ignore read errors and continue with default/local labels.
      } finally {
        if (alive) hasHydratedLabels.current = true;
      }
    };
    void loadLabels();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedLabels.current) return;
    const timer = window.setTimeout(async () => {
      setSaveState("saving");
      try {
        const response = await fetch(LABELS_SAVE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ labels: toLabelsMap(pictures), order: toOrderList(pictures) }),
        });
        if (!response.ok) throw new Error("save failed");
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
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

  const visibleCount = useMemo(() => pictures.length, [pictures.length]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const updateLabel = (id: string, label: string) => {
    setPictures((prev) => prev.map((item) => (item.id === id ? { ...item, label } : item)));
  };

  const downloadAll = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      for (const picture of pictures) {
        const res = await fetch(picture.src);
        if (!res.ok) continue;
        const blob = await res.blob();
        zip.file(picture.fileName, blob);
      }
      const zipped = await zip.generateAsync({ type: "blob" });
      const href = URL.createObjectURL(zipped);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = "usha-tiger-21-pictures.zip";
      anchor.click();
      URL.revokeObjectURL(href);
    } finally {
      setIsDownloading(false);
    }
  };

  const current = pictures[presentIndex];
  const pictureIds = useMemo(() => pictures.map((picture) => picture.id), [pictures]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setPictures((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <main className="h-screen bg-background text-foreground p-6 overflow-y-auto overflow-x-hidden">
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
          <div className="smallcaps text-[0.65rem] border border-foreground/30 px-3 py-1">{visibleCount}/{MAX_PICTURES}</div>
          <div className="smallcaps text-[0.65rem] border border-foreground/30 px-3 py-1">
            {saveState === "saving" ? "Saving names..." : saveState === "saved" ? "Names saved" : saveState === "error" ? "Save failed" : "Ready"}
          </div>
          <button type="button" onClick={() => void downloadAll()} disabled={isDownloading} className="smallcaps text-[0.65rem] border border-foreground/30 px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed">
            {isDownloading ? "Downloading..." : "Download All"}
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
      </header>

      <p className="text-sm text-foreground/65 mb-4">
        Loading from repo assets in `public/usha-pictures` (mirrored from the Usha Tiger21 pictures and documents category). Scroll to browse all images. Drag and pick up any card to any other position as well.
      </p>
      <div className="mb-4 text-xs text-foreground/70 flex flex-wrap gap-3">
        {DOCUMENT_FILES.map((file) => (
          <a key={file} href={toRepoAssetUrl(file)} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
            {file.replace("documents/", "")}
          </a>
        ))}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={pictureIds} strategy={rectSortingStrategy}>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
            {pictures.map((picture, index) => (
              <SortablePictureCard key={picture.id} picture={picture} index={index} onLabelChange={updateLabel} />
            ))}
          </section>
        </SortableContext>
      </DndContext>

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
