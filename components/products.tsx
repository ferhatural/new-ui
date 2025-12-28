"use client";
import React, { useState } from "react";
import Image from "next/image";

export const ProductsView: React.FC = () => {
  const products = [
    {
      name: "Momento Silan İç Cephe Boyası",
      image: "https://www.filliboya.com/cdn-cgi/image/w=624,h=624,fit=crop/uploads/MOMENTO-SILAN-2.5L.png",
      description: "Momento Silan, Filli Boya tarafından yenilikçi Aktif Silikon Teknolojisi kullanılarak geliştirilen hem silinebilir hem de yıkanabilir özellikleriyle öne çıkan iç cephe boyasıdır.",
      category: "İç Cephe",
    },
    {
      name: "Aqualux İç Cephe Boyası",
      image: "https://www.filliboya.com/cdn-cgi/image/w=624,h=624,fit=crop/uploads/AQUALUX-2.5-WEB.png",
      description: "Duvarlarınız için su bazlı lüks parlak doku ve üstün beyazlık sunar. Tam silinebilir ve yıkanabilir özelliktedir.",
      category: "İç Cephe",
    },
    {
      name: "Aqua Reno® Mutfak Boyası",
      image: "https://www.filliboya.com/cdn-cgi/image/w=636/uploads/aqua-reno-mutfak-2.5.png",
      description: "Aqua Reno® Mutfak ev güzelleştirme fikirleri için geliştirilen ipeksi mat dokuda tam silinebilen ve yıkanabilen kendinden katalizörlü polimer (Self Catalyzed Polymer) teknolojisine sahip su bazlı çok amaçlı renovasyon boyasıdır.",
      category: "Hobi",
    },
  ];

  const [currentProduct, setCurrentProduct] = useState<number>(0);

  const handleProductClick = (idx: number) => {
    setCurrentProduct(idx);
  };

  return (
    <div className="flex flex-row justify-center items-center min-h-screen w-full backdrop-blur-xl">
      {/* Ortada büyük ürün görseli ve açıklaması */}
      <div className="flex-1 flex flex-col justify-center items-center"
        style={{ marginLeft: 280 }} >
        <div className="bg-white/30 p-6 rounded-2xl shadow-lg mb-6 w-auto max-w-md text-center items-center">
          <div className="relative mx-auto mb-6 w-[60%] h-[40vh] min-h-[300px]">
            <Image
              src={products[currentProduct].image}
              alt={products[currentProduct].name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">{products[currentProduct].name}</h2>
          <p className="text-base text-gray-700 mb-2">{products[currentProduct].description}</p>
          <span className="text-sm text-gray-500">{products[currentProduct].category}</span>
        </div>
      </div>
      {/* Sağda ürün paleti */}
      <div className="flex flex-col items-center gap-6 p-8 bg-white/30 rounded-l-2xl shadow-lg min-w-[160px]">
        {products.map((product, idx) => (
          <div
            key={product.name}
            className={`flex flex-col items-center cursor-pointer p-3 rounded-xl ${currentProduct === idx ? "text-neutral-900" : "text-neutral-500"}`}
            onClick={() => handleProductClick(idx)}
          >
            <div className="relative w-12 h-12 mb-2">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-md"
                sizes="48px"
              />
            </div>
            <span className={`text-sm font-medium`}>{product.name}</span>
            <span className="text-xs">{product.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};