"use client";

import { useState } from "react";
import { Mail, Camera, Home, BarChart3, ShoppingBag, Contact, MapIcon, PaintBucketIcon, Brush, LucideBrush, BrushCleaning, PencilLine, LucidePaintBucket, TagIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface BottomNavigationProps {
  onMessage: (message: string) => Promise<void>;
  isProcessing: boolean;
  hasMessages: boolean;
}

export function BottomNavigation({
  onMessage,
  isProcessing,
  hasMessages,
}: BottomNavigationProps) {
  const [message, setMessage] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const suggestedActions = [
    { title: "Yılın renkleri neler?", action: "Yılın renkleri" },
    { title: "Renk seçmek istiyorum", action: "show colors" },
    { title: "Nasıl iletişim kurabiliriz?", action: "show contact" },
    { title: "Boya ustası lazım", action: "find a painter" },
    { title: "Odamı boyamak istiyorum", action: "odamı boyamak istiyorum" }
  ];

  const handleAIResponse = async (userMessage: string) => {
    console.log("BottomNavigation: handleAIResponse called with:", userMessage);
    await onMessage(userMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      console.log("BottomNavigation: form submitted with message:", message);
      console.log("BottomNavigation: message is valid, proceeding");

      await handleAIResponse(message);
      setMessage("");
    } else {
      console.log("BottomNavigation: message is empty, not submitting");
    }
  };

  const handleSuggestedAction = async (action: string) => {
    await handleAIResponse(action);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-sm pt-3 dark:bg-zinc-900/80">
        <div className="w-full px-4">
          {/* Suggested Actions - Badge style above navigation */}
          {(
            <div className="py-2">
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedAction(action.action)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {action.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Layout - Logo + Input + Hamburger in single row */}
          <div className="lg:hidden">
            {/* Collapsible Menu - appears above navbar when open */}
            {isMobileMenuOpen && (
              <div className="border-b border-zinc-200/50 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
                <div className="py-2 px-4">
                  {/* Horizontal Menu Items */}
                  <div className="flex items-center justify-between space-x-1 overflow-x-auto">
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          handleAIResponse("show cameras");
                          setIsMobileMenuOpen(false);
                        }}
                        className="inline-flex h-8 px-2 text-xs font-medium items-center transition-opacity hover:opacity-60 focus:outline-none will-change-[opacity] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 whitespace-nowrap"
                      >
                        <Camera className="h-3 w-3 mr-1" />
                        <span>Renkler</span>
                      </button>

                      <button
                        onClick={() => {
                          handleAIResponse("show hub");
                          setIsMobileMenuOpen(false);
                        }}
                        className="inline-flex h-8 px-2 text-xs font-medium items-center transition-opacity hover:opacity-60 focus:outline-none will-change-[opacity] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 whitespace-nowrap"
                      >
                        <Home className="h-3 w-3 mr-1" />
                        <span>Hubby</span>
                      </button>

                      <button
                        onClick={() => {
                          handleAIResponse("ilham veren fikirler");
                          setIsMobileMenuOpen(false);
                        }}
                        className="inline-flex h-8 px-2 text-xs font-medium items-center transition-opacity hover:opacity-60 focus:outline-none will-change-[opacity] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 whitespace-nowrap"
                      >
                        <PencilLine className="h-3 w-3 mr-1" />
                        <span>İlham</span>
                      </button>

                      <button
                        onClick={() => {
                          handleAIResponse("contact support");
                          setIsMobileMenuOpen(false);
                        }}
                        className="inline-flex h-8 px-2 text-xs font-medium items-center transition-opacity hover:opacity-60 focus:outline-none will-change-[opacity] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 whitespace-nowrap"
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        <span>Contact</span>
                      </button>
                    </div>

                    <div className="flex items-center flex-shrink-0">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Mobile Navbar - Logo + Input + Hamburger */}
            <nav className="flex items-center py-2 space-x-3">
              {/* Logo - Left */}
              <div className="flex-shrink-0">
                <Image
                  src="/logo-icon.png"
                  alt="AI Assistant"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>

              {/* Chat Input - Flexible center */}
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full h-10 px-4 pr-12 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    disabled={isProcessing}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || isProcessing}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>

              {/* Hamburger Menu - Right */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="h-10 w-10 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12h18" />
                      <path d="M3 6h18" />
                      <path d="M3 18h18" />
                    </svg>
                  )}
                </button>
              </div>
            </nav>
          </div>

          {/* Desktop/Tablet Layout - Horizontal with maximum stretch between logo and menu */}
          <nav className="hidden lg:flex items-center py-2">
            {/* Logo - Fixed to the left (Full logo on desktop) */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <Image
                  src="/images/filli-logo.png"
                  alt="AI Assistant"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
            </div>

            {/* Chat Input - Use ALL available space between logo and menu */}
            <div className="flex-1 flex justify-center px-2 mx-2">
              <div className="w-full">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ne yapmak istersiniz?"
                    className="w-full h-10 px-4 pr-12 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    disabled={isProcessing}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || isProcessing}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Desktop Menu - Fixed to the right */}
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                {/* Quick Action Buttons */}
                <button
                  onClick={() => handleAIResponse("tüm renkleri göster")}
                  className="inline-flex h-10 px-3 text-sm font-medium items-center transition-opacity hover:opacity-60 focus:outline-none will-change-[opacity] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <PaintBucketIcon className="h-4 w-4 mr-2" />
                  <span>Renkler</span>
                </button>

                <button
                  onClick={() => handleAIResponse("show products")}
                  className="inline-flex h-10 px-3 text-sm font-medium items-center transition-opacity hover:opacity-60 focus:outline-none will-change-[opacity] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <TagIcon className="h-4 w-4 mr-2" />
                  <span>Ürünler</span>
                </button>

                <button
                  onClick={() => handleAIResponse("ilham veren fikirler")}
                  className="inline-flex h-10 px-3 text-sm font-medium items-center transition-opacity hover:opacity-60 focus:outline-none will-change-[opacity] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <PencilLine className="h-4 w-4 mr-2" />
                  <span>İlham Veren Fikirler</span>
                </button>

                <button
                  onClick={() => handleAIResponse("contact support")}
                  className="inline-flex h-10 px-3 text-sm font-medium items-center transition-opacity hover:opacity-60 focus:outline-none will-change-[opacity] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <BrushCleaning className="h-4 w-4 mr-2" />
                  <span>Hizmetler</span>
                </button>

                <button
                  onClick={() => handleAIResponse("contact support")}
                  className="inline-flex h-10 px-3 text-sm font-medium items-center transition-opacity hover:opacity-60 focus:outline-none will-change-[opacity] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <MapIcon className="h-4 w-4 mr-2" />
                  <span>İletişim</span>
                </button>

                <button
                  onClick={() => handleAIResponse("contact support")}
                  className="inline-flex h-10 px-3 text-sm font-medium items-center transition-opacity hover:opacity-60 focus:outline-none will-change-[opacity] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  <span>Sepetim</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
