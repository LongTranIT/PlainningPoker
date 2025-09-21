/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef, HTMLAttributes } from "react";
import { motion, PanInfo } from "framer-motion";
import { CardData } from "@/model/avatar";
import clsx from "clsx";
interface IconProps {
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

interface CardProps {
  card: CardData;
  index: number;
  activeIndex: number;
  totalCards: number;
}

interface CarouselProps {
  cardData: CardData[];
  initCardId?: number;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  onChange?: (card: CardData) => void;
}

const FaceIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-2 0 48 48"
    width="24"
    height="24"
    fill="currentColor"
    className={className}
  >
    <g transform="translate(-128 -214)">
      <g>
        <circle
          cx="3"
          cy="3"
          r="3"
          transform="translate(142 230)"
          fill="currentColor"
        />
        <circle
          cx="3"
          cy="3"
          r="3"
          transform="translate(152 230)"
          fill="currentColor"
        />
        <path d="M155,241a5,5,0,0,1-10,0Z" fill="currentColor" />
      </g>
      <path
        d="M168.887,260a18.964,18.964,0,0,0-7.531-13.228,14.92,14.92,0,0,0,3.6-8.868,5,5,0,0,0,.145-9.782l4.608-7.488A4.037,4.037,0,0,0,166,214H150a15.02,15.02,0,0,0-14.973,14.1,5,5,0,0,0,.019,9.809,14.92,14.92,0,0,0,3.6,8.868A18.967,18.967,0,0,0,131.113,260H128v2h44v-2ZM133,233a3.006,3.006,0,0,1,2-2.829v5.658A3.006,3.006,0,0,1,133,233Zm4-4a13.015,13.015,0,0,1,13-13h16a2.1,2.1,0,0,1,2,3.586l-5,8.131V230h1a3,3,0,0,1,0,6h-1v1a13,13,0,0,1-26,0Zm-3.88,31a16.976,16.976,0,0,1,6.949-11.789,14.909,14.909,0,0,0,19.862,0A16.976,16.976,0,0,1,166.88,260Z"
        fill="currentColor"
      />
    </g>
  </svg>
);

const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const Badge: React.FC<BadgeProps> = ({ children, className }) => (
  <div
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${className}`}
  >
    {children}
  </div>
);

export default function Carousel({
  cardData,
  initCardId,
  className,
  onChange,
}: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(cardData.length / 2)
  );
  const [isPaused, setIsPaused] = useState(false);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayDelay = 3000;

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % cardData.length);
  };

  useEffect(() => {
    if (!isPaused) {
      autoplayIntervalRef.current = setInterval(goToNext, autoplayDelay);
    }
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [isPaused, activeIndex]);

  const changeSlide = (newIndex: number) => {
    const newSafeIndex = (newIndex + cardData.length) % cardData.length;
    setActiveIndex(newSafeIndex);
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    if (!isPaused) {
      autoplayIntervalRef.current = setInterval(goToNext, autoplayDelay);
    }
  };

  const onDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const dragThreshold = 75;
    const dragOffset = info.offset.x;
    if (dragOffset > dragThreshold) {
      changeSlide(activeIndex - 1);
    } else if (dragOffset < -dragThreshold) {
      changeSlide(activeIndex + 1);
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(cardData[activeIndex]);
    }
  }, [activeIndex, onChange, cardData]);

  useEffect(() => {
    console.log("initCardId", initCardId);
    if (!initCardId) return;
    const initIndex = cardData.findIndex((card) => card.id === initCardId);
    if (initIndex !== -1) {
      setActiveIndex(initIndex);
      setIsPaused(true);
    }
  }, []);

  return (
    <section
      className={clsx(
        "flex-col items-center justify-center font-sans overflow-hidden",
        className
      )}
    >
      <div
        className="w-full h-full max-w-5xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="h-full relative flex w-full flex-col rounded-3xl border border-white/10 dark:border-white/10  dark:bg-neutral-900 p-4 md:p-6">
          <Badge className="absolute left-4 top-6 rounded-xl border border-gray-300 dark:border-white/10 text-base text-gray-700 dark:text-white/80 bg-gray-100/80 dark:bg-black/20 backdrop-blur-sm md:left-[24%]">
            <FaceIcon className="text-[#5115aa] h-5 w-5 mr-1" />
            Avatar
          </Badge>

          <div className="relative w-full h-full flex items-center justify-center overflow-hidden pt-12">
            <motion.div
              className="w-full h-full flex items-center justify-center"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
            >
              {cardData.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  activeIndex={activeIndex}
                  totalCards={cardData.length}
                />
              ))}
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={() => changeSlide(activeIndex - 1)}
              className="p-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center gap-2">
              {cardData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    activeIndex === index
                      ? "w-6 bg-pink-400"
                      : "w-2 bg-gray-300 dark:bg-neutral-600 hover:bg-gray-400 dark:hover:bg-neutral-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => changeSlide(activeIndex + 1)}
              className="p-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ card, index, activeIndex, totalCards }: CardProps) {
  let offset = index - activeIndex;
  if (offset > totalCards / 2) {
    offset -= totalCards;
  } else if (offset < -totalCards / 2) {
    offset += totalCards;
  }

  const isVisible = Math.abs(offset) <= 1;

  const animate = {
    x: `${offset * 50}%`,
    scale: offset === 0 ? 1 : 0.8,
    zIndex: totalCards - Math.abs(offset),
    opacity: isVisible ? 1 : 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 30 },
  };

  return (
    <motion.div
      className="absolute w-1/2 md:w-1/3 h-[95%]"
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={animate}
      initial={false}
    >
      <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-gray-200 dark:bg-neutral-800">
        <img
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-full object-cover pointer-events-none"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src =
              "https://placehold.co/400x600/1e1e1e/ffffff?text=Image+Missing";
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <h4 className="text-white text-lg font-semibold">{card.title}</h4>
        </div>
      </div>
    </motion.div>
  );
}
