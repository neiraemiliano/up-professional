import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import useArrows from "../../hooks/useArrows";

const Carousel = ({ children }) => {
  const { wrapperRef, trackRef, atStart, atEnd, scrollLeft, scrollRight } =
    useArrows();

  return (
    <div className="relative w-full overflow-hidden" ref={wrapperRef}>
      <ul
        ref={trackRef}
        className="flex gap-2 overflow-x-auto scroll-smooth 
                   snap-x snap-mandatory hide-scroll"
      >
        {children}
      </ul>
      <button
        onClick={scrollLeft}
        disabled={atStart}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                   p-2 bg-white rounded-full shadow-md
                   disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={scrollRight}
        disabled={atEnd}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                   p-2 bg-white rounded-full shadow-md
                   disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Carousel;
