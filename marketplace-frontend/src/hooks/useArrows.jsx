import { useCallback, useEffect, useRef, useState } from "react";

const useArrows = () => {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* ───────── helpers ───────── */
  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 0);
    setAtEnd(track.scrollLeft >= max - 1);
  }, []);

  /* desplaza el ancho visible del wrapper */
  const scrollByPage = (dir) => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;
    track.scrollBy({
      left: dir === "right" ? wrapper.clientWidth : -wrapper.clientWidth,
      behavior: "smooth",
    });
  };

  /* listeners */
  useEffect(() => {
    updateArrows();

    const track = trackRef.current;
    track?.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      track?.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  return {
    wrapperRef,
    trackRef,
    atStart,
    atEnd,
    scrollLeft: () => scrollByPage("left"),
    scrollRight: () => scrollByPage("right"),
  };
};

export default useArrows;
