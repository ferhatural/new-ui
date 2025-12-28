import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const images = [
  "/images/slider1.png",
  "/images/slider2.png",
  "/images/slider3.png",
];

type ImageSliderProps = {
  isBlur?: boolean;
  isSliding?: boolean;
};

export const ImageSlider: React.FC<ImageSliderProps> = ({ isBlur, isSliding = true }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => setCurrent((prev) => (prev + 1) % images.length), []);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (!isSliding) return;
    const interval = setInterval(nextSlide, 5000); // 5 saniyede bir geçiş
    return () => clearInterval(interval);
  }, [isSliding, nextSlide]);

  return (
    <div
      className={isBlur ? "blur-md" : ""}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {images.map((src, idx) => (
        <div
          key={src}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            opacity: idx === current ? 1 : 0,
            transition: "opacity 0.6s",
          }}
        >
          <Image
            src={src}
            alt={`slide-${idx}`}
            fill
            style={{
              objectFit: "cover",
            }}
            priority={idx === 0}
          />
        </div>
      ))}

    </div>
  );
};