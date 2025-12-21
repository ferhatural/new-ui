"use client";

export const LoadingDots = () => {
  return (
    <div className="fixed bottom-24 mb-10 left-0 right-0 z-[110] px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="px-4 py-2">
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
