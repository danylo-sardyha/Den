import { useState, useRef, useEffect } from "react";

type Format = "Book" | "Video Game" | "Movie" | "TV Show" | "Album";
type Status = "Completed" | "In Progress" | "Unread";

interface MediaItem {
  id: number;
  title: string;
  format: Format;
  status: Status;
  rating: number;
}

const SEED_DATA: MediaItem[] = [
  {
    id: 1,
    title: "The Dispossessed",
    format: "Book",
    status: "Completed",
    rating: 5,
  },
  {
    id: 2,
    title: "Disco Elysium",
    format: "Video Game",
    status: "Completed",
    rating: 5,
  },
  {
    id: 3,
    title: "Annihilation",
    format: "Movie",
    status: "Completed",
    rating: 4,
  },
  {
    id: 4,
    title: "Severance",
    format: "TV Show",
    status: "In Progress",
    rating: 4,
  },
  {
    id: 5,
    title: "OK Computer",
    format: "Album",
    status: "Completed",
    rating: 5,
  },
  { id: 6, title: "Piranesi", format: "Book", status: "Completed", rating: 4 },
  {
    id: 7,
    title: "Outer Wilds",
    format: "Video Game",
    status: "Completed",
    rating: 5,
  },
  {
    id: 8,
    title: "Past Lives",
    format: "Movie",
    status: "Completed",
    rating: 4,
  },
  {
    id: 9,
    title: "The Left Hand of Darkness",
    format: "Book",
    status: "In Progress",
    rating: 0,
  },
  { id: 10, title: "Shogun", format: "TV Show", status: "Unread", rating: 0 },
  {
    id: 11,
    title: "In Rainbows",
    format: "Album",
    status: "Unread",
    rating: 0,
  },
  {
    id: 12,
    title: "Hollow Knight",
    format: "Video Game",
    status: "In Progress",
    rating: 3,
  },
];

const FORMAT_STYLES: Record<Format, { bg: string; text: string }> = {
  Book: { bg: "bg-[rgba(100,160,130,0.12)]", text: "text-[#72b898]" },
  "Video Game": { bg: "bg-[rgba(120,100,180,0.12)]", text: "text-[#9b84d4]" },
  Movie: { bg: "bg-[rgba(180,90,90,0.12)]", text: "text-[#d47272]" },
  "TV Show": { bg: "bg-[rgba(80,140,190,0.12)]", text: "text-[#6ab0d8]" },
  Album: { bg: "bg-[rgba(190,140,70,0.12)]", text: "text-[#d4a84a]" },
};

const STATUS_STYLES: Record<Status, { bg: string; text: string; dot: string }> =
  {
    Completed: {
      bg: "bg-[rgba(90,160,100,0.12)]",
      text: "text-[#74b882]",
      dot: "bg-[#74b882]",
    },
    "In Progress": {
      bg: "bg-[rgba(201,147,58,0.12)]",
      text: "text-[#c9933a]",
      dot: "bg-[#c9933a]",
    },
    Unread: {
      bg: "bg-[rgba(100,100,100,0.12)]",
      text: "text-[#8a8680]",
      dot: "bg-[#8a8680]",
    },
  };

const FORMATS: Format[] = ["Book", "Video Game", "Movie", "TV Show", "Album"];
const STATUSES: Status[] = ["Completed", "In Progress", "Unread"];

function StarRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= (onChange ? hovered || rating : rating);
        return (
          <button
            key={n}
            type={onChange ? "button" : undefined}
            onClick={onChange ? () => onChange(n) : undefined}
            onMouseEnter={onChange ? () => setHovered(n) : undefined}
            onMouseLeave={onChange ? () => setHovered(0) : undefined}
            className={[
              "text-base leading-none transition-colors duration-100",
              onChange
                ? "cursor-pointer"
                : "cursor-default pointer-events-none",
              filled ? "text-[#c9933a]" : "text-[#2e2e2a]",
            ].join(" ")}
            tabIndex={onChange ? 0 : -1}
            aria-label={
              onChange ? `Rate ${n} star${n > 1 ? "s" : ""}` : undefined
            }
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function FormatBadge({ format }: { format: Format }) {
  const s = FORMAT_STYLES[format];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wider uppercase font-mono ${s.bg} ${s.text}`}
    >
      {format}
    </span>
  );
}

function StatusBadge({
  status,
  onChange,
}: {
  status: Status;
  onChange?: (s: Status) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const s = STATUS_STYLES[status];

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!onChange) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wider uppercase font-mono ${s.bg} ${s.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {status}
      </span>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wider uppercase font-mono cursor-pointer transition-opacity hover:opacity-80 ${s.bg} ${s.text}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {status}
        <span className="ml-0.5 opacity-50">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[130px] rounded-md bg-[#1a1a16] border border-[#2a2a24] shadow-[0_8px_24px_rgba(0,0,0,0.6)] overflow-hidden">
          {STATUSES.map((opt) => {
            const os = STATUS_STYLES[opt];
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] font-mono tracking-wider uppercase transition-colors hover:bg-[#252520] ${opt === status ? "bg-[#202018]" : ""}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${os.dot}`} />
                <span className={os.text}>{opt}</span>
                {opt === status && (
                  <span className="ml-auto text-[#c9933a]">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IconPencil() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-9" />
    </svg>
  );
}

function MediaCard({
  item,
  onChangeStatus,
  onDelete,
  onEdit,
}: {
  item: MediaItem;
  onChangeStatus: (id: number, s: Status) => void;
  onDelete: (id: number) => void;
  onEdit: (item: MediaItem) => void;
}) {
  return (
    <article className="group relative flex flex-col gap-3 p-5 rounded-md bg-[#141412] border border-[#252420] hover:border-[#352f22] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Action buttons — fade in on hover */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onEdit(item)}
          className="w-6 h-6 flex items-center justify-center rounded text-[#5a5a54] hover:text-[#c9933a] hover:bg-[rgba(201,147,58,0.1)] transition-colors"
          aria-label={`Edit ${item.title}`}
        >
          <IconPencil />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="w-6 h-6 flex items-center justify-center rounded text-[#5a5a54] hover:text-[#d47272] hover:bg-[rgba(180,90,90,0.1)] transition-colors"
          aria-label={`Delete ${item.title}`}
        >
          <IconTrash />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 pr-14">
        <FormatBadge format={item.format} />
        <StatusBadge
          status={item.status}
          onChange={(s) => onChangeStatus(item.id, s)}
        />
      </div>

      <h2
        className="text-[#e8e4dc] leading-snug"
        style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}
      >
        {item.title}
      </h2>
      <div className="flex items-center gap-2">
        <StarRating rating={item.rating} />
        {item.rating === 0 && (
          <span className="text-[10px] font-mono text-[#4a4a46] uppercase tracking-widest">
            Not yet rated
          </span>
        )}
      </div>
      <div className="absolute inset-0 rounded-md ring-1 ring-inset ring-white/[0.03] pointer-events-none" />
    </article>
  );
}

interface AddModalProps {
  onClose: () => void;
  onAdd: (item: Omit<MediaItem, "id">) => void;
}

function AddModal({ onClose, onAdd }: AddModalProps) {
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState<Format>("Book");
  const [status, setStatus] = useState<Status>("Unread");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    onAdd({ title: title.trim(), format, status, rating });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-lg bg-[#141412] border border-[#2a2a24] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-[#1f1f1b]">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              color: "#e8e4dc",
            }}
          >
            Add to Den
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[#5a5a54] hover:text-[#e8e4dc] hover:bg-[#1e1e1a] transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-medium tracking-widest uppercase text-[#6a6a64]">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="Enter a title…"
              className="w-full px-3 py-2.5 rounded-md bg-[#0d0d0b] border border-[#252420] text-[#e8e4dc] text-sm placeholder-[#3a3a36] focus:outline-none focus:border-[#c9933a] focus:ring-1 focus:ring-[rgba(201,147,58,0.3)] transition-colors font-sans"
              autoFocus
            />
            {error && (
              <p className="text-xs font-mono text-[#d47272]">{error}</p>
            )}
          </div>

          {/* Format + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-medium tracking-widest uppercase text-[#6a6a64]">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
                className="w-full px-3 py-2.5 rounded-md bg-[#0d0d0b] border border-[#252420] text-[#e8e4dc] text-sm focus:outline-none focus:border-[#c9933a] focus:ring-1 focus:ring-[rgba(201,147,58,0.3)] transition-colors appearance-none cursor-pointer font-sans"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236a6a64' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-medium tracking-widest uppercase text-[#6a6a64]">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2.5 rounded-md bg-[#0d0d0b] border border-[#252420] text-[#e8e4dc] text-sm focus:outline-none focus:border-[#c9933a] focus:ring-1 focus:ring-[rgba(201,147,58,0.3)] transition-colors appearance-none cursor-pointer font-sans"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236a6a64' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-medium tracking-widest uppercase text-[#6a6a64]">
              Rating
            </label>
            <div className="flex items-center gap-3">
              <div className="scale-125 origin-left">
                <StarRating rating={rating} onChange={setRating} />
              </div>
              {rating === 0 ? (
                <span className="text-[11px] font-mono text-[#4a4a46]">
                  No rating yet
                </span>
              ) : (
                <span className="text-[11px] font-mono text-[#c9933a]">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-md text-sm font-medium text-[#6a6a64] bg-[#1a1a18] hover:bg-[#222220] hover:text-[#e8e4dc] border border-[#252420] transition-colors font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-md text-sm font-semibold text-[#0d0d0b] bg-[#c9933a] hover:bg-[#d9a34a] transition-colors font-sans"
            >
              Add to Den
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditModal({
  item,
  onClose,
  onSave,
}: {
  item: MediaItem;
  onClose: () => void;
  onSave: (updated: MediaItem) => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [format, setFormat] = useState<Format>(item.format);
  const [status, setStatus] = useState<Status>(item.status);
  const [rating, setRating] = useState(item.rating);
  const [error, setError] = useState("");

  const selectClass =
    "w-full px-3 py-2.5 rounded-md bg-[#0d0d0b] border border-[#252420] text-[#e8e4dc] text-sm focus:outline-none focus:border-[#c9933a] focus:ring-1 focus:ring-[rgba(201,147,58,0.3)] transition-colors appearance-none cursor-pointer font-sans";
  const chevron = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236a6a64' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    onSave({ ...item, title: title.trim(), format, status, rating });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-lg bg-[#141412] border border-[#2a2a24] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-[#1f1f1b]">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              color: "#e8e4dc",
            }}
          >
            Edit Item
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[#5a5a54] hover:text-[#e8e4dc] hover:bg-[#1e1e1a] transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-medium tracking-widest uppercase text-[#6a6a64]">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2.5 rounded-md bg-[#0d0d0b] border border-[#252420] text-[#e8e4dc] text-sm placeholder-[#3a3a36] focus:outline-none focus:border-[#c9933a] focus:ring-1 focus:ring-[rgba(201,147,58,0.3)] transition-colors font-sans"
              autoFocus
            />
            {error && (
              <p className="text-xs font-mono text-[#d47272]">{error}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-medium tracking-widest uppercase text-[#6a6a64]">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
                className={selectClass}
                style={chevron}
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-medium tracking-widest uppercase text-[#6a6a64]">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className={selectClass}
                style={chevron}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-medium tracking-widest uppercase text-[#6a6a64]">
              Rating
            </label>
            <div className="flex items-center gap-3">
              <div className="scale-125 origin-left">
                <StarRating rating={rating} onChange={setRating} />
              </div>
              {rating === 0 ? (
                <span className="text-[11px] font-mono text-[#4a4a46]">
                  No rating yet
                </span>
              ) : (
                <span className="text-[11px] font-mono text-[#c9933a]">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-md text-sm font-medium text-[#6a6a64] bg-[#1a1a18] hover:bg-[#222220] hover:text-[#e8e4dc] border border-[#252420] transition-colors font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-md text-sm font-semibold text-[#0d0d0b] bg-[#c9933a] hover:bg-[#d9a34a] transition-colors font-sans"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type FilterFormat = Format | "All";
type FilterStatus = Status | "All";

export default function App() {
  const [items, setItems] = useState<MediaItem[]>(SEED_DATA);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [filterFormat, setFilterFormat] = useState<FilterFormat>("All");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");

  function handleAdd(item: Omit<MediaItem, "id">) {
    setItems((prev) => [{ ...item, id: Date.now() }, ...prev]);
  }

  function handleChangeStatus(id: number, status: Status) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  function handleSaveEdit(updated: MediaItem) {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const filtered = items.filter((item) => {
    if (filterFormat !== "All" && item.format !== filterFormat) return false;
    if (filterStatus !== "All" && item.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: items.length,
    completed: items.filter((i) => i.status === "Completed").length,
    inProgress: items.filter((i) => i.status === "In Progress").length,
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: "#0d0d0b" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-[#1a1a16]"
        style={{
          background: "rgba(13,13,11,0.92)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                color: "#e8e4dc",
                letterSpacing: "-0.01em",
              }}
            >
              Den
            </h1>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#3a3a36] pt-1">
              Media Tracker
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-[#0d0d0b] bg-[#c9933a] hover:bg-[#d9a34a] transition-colors shadow-[0_2px_12px_rgba(201,147,58,0.25)] font-sans"
          >
            <span className="text-base leading-none">+</span>
            Add New Item
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Stats row */}
        <div className="flex items-center gap-6 mb-8">
          {[
            { label: "Total", value: stats.total },
            { label: "Completed", value: stats.completed },
            { label: "In Progress", value: stats.inProgress },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span
                className="text-xl font-semibold text-[#e8e4dc]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.value}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#4a4a46]">
                {s.label}
              </span>
            </div>
          ))}
          <div className="flex-1" />
          {/* Filter chips */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex rounded-md overflow-hidden border border-[#252420]">
              {(["All", ...FORMATS] as FilterFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterFormat(f)}
                  className={[
                    "px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-colors border-r border-[#252420] last:border-r-0",
                    filterFormat === f
                      ? "bg-[#1e1e1a] text-[#c9933a]"
                      : "bg-transparent text-[#5a5a54] hover:text-[#9a9a94] hover:bg-[#141412]",
                  ].join(" ")}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex rounded-md overflow-hidden border border-[#252420]">
              {(["All", ...STATUSES] as FilterStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={[
                    "px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-colors border-r border-[#252420] last:border-r-0",
                    filterStatus === s
                      ? "bg-[#1e1e1a] text-[#c9933a]"
                      : "bg-transparent text-[#5a5a54] hover:text-[#9a9a94] hover:bg-[#141412]",
                  ].join(" ")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                color: "#3a3a36",
              }}
            >
              Nothing here yet.
            </p>
            <p className="text-xs font-mono text-[#2e2e2a] tracking-wide">
              Add something to your den.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onChangeStatus={handleChangeStatus}
                onDelete={handleDelete}
                onEdit={setEditItem}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <AddModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
