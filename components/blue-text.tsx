"use client";

import { useEffect, useState } from "react";
import { getAnimationClasses } from "@/components/text-animations";

// Blue wipe text component - properly positioned and animated with auto-fade
export const BlueText = ({ children }: { children: React.ReactNode }) => {
  const [isAppearing, setIsAppearing] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // A short delay to ensure the component is mounted before starting the animation.
    const wipeTimer = setTimeout(() => setIsAppearing(false), 50);

    // Auto-fade after 5 seconds
    const fadeTimeout = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Allow time for fade transition
    }, 5000);

    return () => {
      clearTimeout(wipeTimer);
      clearTimeout(fadeTimeout);
    };
  }, []);

  //if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-24 mb-10 left-0 right-0 z-[100] px-4 transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="max-w-4xl rounded-3xl mx-auto text-center">
        {/* The Card Container */}
        <div className="relative rounded-3xl inline-block">
          {/* Layer 1: The soft, animated outer glow */}
          <div
            className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-[length:200%_200%] opacity-60 blur-md animate-gradient-pan"
            aria-hidden="true"
          />

          {/* Layer 2: The Content (gets wiped) */}
          <p
            className={`relative text-xl font-medium text-gray-600 dark:text-blue-400 bg-white/50 dark:bg-zinc-900/70 backdrop-blur-xxs rounded-2xl px-6 py-4 before:absolute before:inset-0 before:rounded-2xl before:border-2 before:border-purple-400/30 before:content-[''] ${getAnimationClasses(
              "fade",
              isAppearing
            )}`}
          >
            {children}
          </p>
        </div>
      </div>
    </div>
  );
};
