"use client";
import React, { useState } from "react";
import Image from "next/image";

export const ColorsView: React.FC = () => {
  const colors = [
    { name: "Kaktüs 90", code: "rgb(96,145,103)" },
    { name: "Kaktüs 50", code: "rgb(190,215,195)" },
    { name: "Kıvılcım 90", code: "rgb(217,110,81)" },
    { name: "Aydan", code: "rgb(248,247,246)" },
    { name: "Hasır 40", code: "rgb(240,232,225)" },
    { name: "Kozmik 115", code: "rgb(118,168,197)" },
  ];

  const images = [
    "/images/oda001.png",
    "/images/oda002.png",
    "/images/oda003.png",
  ];
  const [bgColor, setBgColor] = useState<string>("transparent");
  const [currentImg, setCurrentImg] = useState<number>(0);

  const handleImageClick = () => {
    setCurrentImg((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="flex flex-row justify-center items-center min-h-screen w-full"
      style={{ backgroundColor: bgColor, transition: "background 0.3s" }}
    >
      {/* Ortadaki büyük görsel */}
      <div
        className="flex-1 flex justify-center items-center relative h-[80vh]"
        style={{ marginLeft: 160 }} // Sağdaki palet kadar boşluk bırak
      >
        <div className="relative w-[80%] h-full">
          <Image
            className="rounded-2xl shadow-lg object-contain"
            src={images[currentImg]}
            alt="Salon"
            fill
            onClick={handleImageClick}
            style={{
              cursor: "pointer",
            }}
            sizes="(max-width: 1200px) 100vw, 80vw"
          />
        </div>
      </div>
      {/* Sağdaki renk paleti */}
      <div className="flex flex-col items-center gap-6 p-8 bg-white/70 rounded-l-2xl shadow-lg min-w-[160px]">
        {colors.map((color) => (
          <div
            key={color.code}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setBgColor(color.code)}
          >
            <div
              className="rounded-full mb-2"
              style={{
                backgroundColor: color.code,
                width: 52,
                height: 52,
                border: "2px solid #dfdfdf",
              }}
            />
            <span className="text-sm font-medium text-neutral-500">{color.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};