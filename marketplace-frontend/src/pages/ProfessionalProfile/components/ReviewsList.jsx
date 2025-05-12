import { ChevronLeft, ChevronRight, Star, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ReviewsCarousel({ reviews = [] }) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  /* ---------- helpers ---------- */
  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 0);
    setAtEnd(el.scrollLeft >= max - 4);
  };

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseInt(getComputedStyle(el).columnGap || "16", 10);
    const delta = (card?.clientWidth || 300) + gap;
    el.scrollBy({ left: dir === "right" ? delta : -delta, behavior: "smooth" });
  };

  useEffect(() => {
    updateArrows();

    const el = trackRef.current;
    el?.addEventListener("scroll", updateArrows, { passive: true });

    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);

    return () => {
      el?.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, []);

  if (!reviews.length) return <p>Aún no hay reseñas.</p>;

  return (
    <div className="relative w-full overflow-hidden">
      {/* TRACK */}
      <ul
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory  hide-scroll"
      >
        {reviews.map((r, index) => (
          <li
            key={`${r.id}-${index}`}
            className="snap-start shrink-0 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 max-w-xs
                       h-60 border rounded-md p-5 bg-white shadow-sm flex flex-col"
          >
            {/* avatar + nombre + rating */}
            <div className="flex items-center gap-3 mb-3">
              {r.user?.avatarUrl ? (
                <img
                  src={r.user.avatarUrl}
                  alt={r.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 p-2 rounded-full bg-gray-200 text-gray-500" />
              )}
              <div>
                <p className="font-medium text-sm">
                  {r.user?.name ?? "Anónimo"}
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < r.rating ? "text-yellow-400" : "text-gray-300"
                      }
                      fill={i < r.rating ? "currentColor" : "transparent"}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* comentario */}
            <p className="text-sm text-gray-700 overflow-auto line-clamp-[7]">
              {r.comment}
            </p>
          </li>
        ))}
      </ul>

      {/* FLECHA IZQ */}
      <button
        onClick={() => scroll("left")}
        disabled={atStart}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                   p-2 bg-white rounded-full shadow-md
                   disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronLeft size={20} />
      </button>

      {/* FLECHA DER */}
      <button
        onClick={() => scroll("right")}
        disabled={atEnd}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                   p-2 bg-white rounded-full shadow-md
                   disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
