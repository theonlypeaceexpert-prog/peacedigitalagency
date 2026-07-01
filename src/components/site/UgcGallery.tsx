import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { ugcItems, type UgcItem } from "@/lib/ugc-data";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ugc-order-v1";
const CATEGORIES = ["All", "UGC", "AI Commercial", "Product Video"] as const;

function loadOrder(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch { return null; }
}

export function UgcGallery() {
  const [items, setItems] = useState<UgcItem[]>(ugcItems);
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const saved = loadOrder();
    if (saved) {
      const map = new Map(ugcItems.map((i) => [i.id, i]));
      const reordered = saved.map((id) => map.get(id)).filter(Boolean) as UgcItem[];
      const missing = ugcItems.filter((i) => !saved.includes(i.id));
      setItems([...reordered, ...missing]);
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setItems((cur) => {
      const oldIndex = cur.findIndex((i) => i.id === active.id);
      const newIndex = cur.findIndex((i) => i.id === over.id);
      const next = arrayMove(cur, oldIndex, newIndex);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next.map((n) => n.id))); } catch {}
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium transition-all border",
                filter === c
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent border-border text-foreground/70 hover:border-foreground/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => setEditMode((v) => !v)}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all border",
            editMode
              ? "bg-accent text-accent-foreground border-accent"
              : "border-border text-foreground/70 hover:border-foreground/40",
          )}
        >
          <GripVertical size={14} />
          {editMode ? "Done reordering" : "Reorder"}
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={filtered.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto">
            {filtered.map((item) => (
              <UgcCard key={item.id} item={item} editMode={editMode} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function UgcCard({ item, editMode }: { item: UgcItem; editMode: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !editMode,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : "auto",
  } as React.CSSProperties;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const isPortrait = item.orientation === "portrait";

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative rounded-3xl overflow-hidden bg-card border border-border shadow-[0_10px_40px_-20px_rgba(0,0,0,0.2)] transition-all",
        "hover:border-accent/50 hover:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.28)] hover:-translate-y-1",
        isPortrait ? "row-span-2" : "row-span-1",
        isDragging && "ring-2 ring-accent shadow-2xl scale-[1.02]",
      )}
    >
      <div
        className={cn(
          "relative bg-neutral-950 overflow-hidden",
          isPortrait ? "aspect-[9/16]" : "aspect-[16/10]",
        )}
        onMouseEnter={() => { const v = videoRef.current; if (v && v.paused) { v.play().catch(() => {}); setPlaying(true); }}}
        onMouseLeave={() => { const v = videoRef.current; if (v && !v.paused) { v.pause(); setPlaying(false); }}}
      >
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
          </div>
        )}
        <video
          ref={videoRef}
          src={item.src}
          preload="metadata"
          playsInline
          muted={muted}
          loop
          onLoadedData={() => setLoaded(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur">
            {item.category}
          </span>
        </div>

        {editMode && (
          <button
            {...attributes}
            {...listeners}
            className="absolute top-3 right-3 h-9 w-9 rounded-full grid place-items-center bg-black/60 text-white backdrop-blur cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 to-transparent">
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="h-10 w-10 rounded-full grid place-items-center bg-white text-black hover:scale-110 transition-transform"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={16} /> : <Play size={16} className="translate-x-0.5" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="h-10 w-10 rounded-full grid place-items-center bg-white/15 text-white backdrop-blur hover:bg-white/25 transition-colors"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base sm:text-lg font-semibold truncate">{item.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{item.brand}</p>
        </div>
      </div>
    </motion.div>
  );
}
