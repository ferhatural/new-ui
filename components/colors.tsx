"use client";
import React, { useState } from "react";

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
        className="flex-1 flex justify-center items-center"
        style={{ marginLeft: 160 }} // Sağdaki palet kadar boşluk bırak
      >
        <img
            className="rounded-2xl shadow-lg"
          src={images[currentImg]}
          alt="Salon"
          onClick={handleImageClick}
          style={{
            maxWidth: "80%",
            maxHeight: "80vh",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            cursor: "pointer",
          }}
        />
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
            <span className="text-sm font-medium">{color.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};