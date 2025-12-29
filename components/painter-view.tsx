"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Painter } from "@/lib/api";

interface PainterViewProps {
    painters?: Painter[];
}

export function PainterView({ painters = [] }: PainterViewProps) {
    const [visibleCount, setVisibleCount] = useState(6);

    const handleLoadMore = () => {
        setVisibleCount((prev: number) => prev + 6);
    };

    if (painters.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-zinc-500">
                <p>Henüz usta bulunamadı.</p>
            </div>
        );
    }

    const visiblePainters = painters.slice(0, visibleCount);

    return (
        <div className="w-full h-full overflow-y-auto p-4 pb-24">
             <div className="mb-4">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Boya Ustaları</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">İstanbul bölgesindeki sertifikalı ustalarımız</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 pt-2">
                {visiblePainters.map((painter, index) => (
                    <div
                        key={index}
                        className="group flex flex-row items-center bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-zinc-100 dark:border-zinc-700 p-4 gap-4"
                    >
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-700">
                           {painter.ProfilePhotoLink ? (
                                <Image
                                    src={painter.ProfilePhotoLink}
                                    alt={`${painter.Name} ${painter.SurName}`}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                           ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </div>
                           )}
                        </div>
                        <div className="flex-1 flex flex-col">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                {painter.Name} {painter.SurName}
                            </h3>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 space-y-1">
                                <div className="flex items-center gap-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                                    <span>Deneyim: {new Date().getFullYear() - parseInt(painter.ExperienceYear || new Date().getFullYear().toString())} Yıl</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    <span>Puan: 9.8</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < painters.length && (
                <div className="flex justify-center pb-8">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium text-sm"
                    >
                        Daha Fazla Usta Göster
                    </button>
                </div>
            )}
        </div>
    );
}
