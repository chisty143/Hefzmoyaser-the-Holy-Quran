"use client";

import { useRef } from "react";
import Image from "next/image";

export default function PageViewer({
  totalPages,
  currentPage,
  imageWidth,
  imageHeight,
  scrollContainerRef,
  handleScroll,
  versesByPage,
  highlightedVerseId,
  setSelectedVerse,
  setHighlightedVerseId,
  isMemorizationMode,
  hoveredVerses, 
  setHoveredVerses,
}) {
  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-x-auto scroll-smooth snap-x snap-mandatory flex flex-row-reverse"
      style={{
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        direction: "ltr",
      }}
    >
      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        const versesOnPage = versesByPage[page] || [];

        return (
          <div
            key={page}
            className="relative flex-shrink-0 w-full h-full snap-start bg-gray-100"
            style={{
              minWidth: "100vw",
              height: "100%",
            }}
          >
            <Image
              src={`images/quran2/${page}.webp`}
              id={`page-${page}`}
              alt={`صفحة ${page}`}
              title={`الحفظ الميسر صفحة ${page}`}
              width={imageWidth}
              height={imageHeight}
              className="absolute top-0 left-0 w-full h-full object-contain z-0"
              loading={page === currentPage ? "eager" : "lazy"}
              priority={page === currentPage}
            />

            <svg
              className="absolute top-0 left-0 w-full h-full z-10"
              viewBox={`0 0 ${imageWidth} ${imageHeight}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              {versesOnPage.map((verse) => {
                const coordsArray = verse.img_coords
                  .split(",")
                  .map((n) => parseInt(n.trim(), 10))
                  .filter((n) => !isNaN(n));

                if (coordsArray.length % 2 !== 0) return null;

                const points = [];
                for (let i = 0; i < coordsArray.length; i += 2) {
                  points.push(`${coordsArray[i]},${coordsArray[i + 1]}`);
                }

               
                const isHovered = hoveredVerses.includes(verse.id);
                const isSelected = verse.id === highlightedVerseId;

                return (
                  <g key={verse.id} id={`ayah-${verse.chapter_id}-${verse.verse_number}`}>
                     <polygon
                      points={points.join(" ")}
                      fill={
                        isMemorizationMode
                          ? isHovered 
                            ? "transparent" 
                            : "rgba(0, 0, 0, 0.99)"
                          : isSelected
                            ? "rgba(0, 123, 255, 0.2)"
                            : "transparent"
                      }
                      stroke={isSelected ? "#007bff" : "transparent"}
                      strokeWidth="2"
                      style={{
                        cursor: isMemorizationMode ? "default" : "pointer",
                        transition: "fill 0.3s ease",
                      }}
                      onMouseEnter={() => {
                        if (isMemorizationMode) {
                          setHoveredVerses(prev => [...prev, verse.id]);
                        }
                      }}
                      onMouseLeave={() => {
                        if (isMemorizationMode) {
                          setHoveredVerses(prev => 
                            prev.filter(id => id !== verse.id)
                          );
                        }
                      }}
                      onClick={() => {
                        if (!isMemorizationMode) {
                          setSelectedVerse(verse);
                          setHighlightedVerseId(verse.id);
                        }
                      }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        );
      })}
    </div>
  );
}