import React, { useState, useEffect } from "react";

const images = [
  "/images/slider1.png",
  "/images/slider2.png",
  "/images/slider3.png",
];

type ImageSliderProps = {
  isBlur?: boolean;
  isSliding?: boolean;
};

export const ImageSlider: React.FC<ImageSliderProps> = ({ isBlur, isSliding=true }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if(!isSliding) return;
    const interval = setInterval(nextSlide, 5000); // 5 saniyede bir geçiş
    return () => clearInterval(interval);
  }, [current]);

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
        <img
          key={src}
          src={src}
          alt={`slide-${idx}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            opacity: idx === current ? 1 : 0,
            transition: "opacity 0.6s",
          }}
        />
      ))}
      
    </div>
  );
};