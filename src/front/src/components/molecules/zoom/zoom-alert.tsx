"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const ZoomAlert = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenZoomAlert = localStorage.getItem("hasSeenZoomAlert");
    if (!hasSeenZoomAlert) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("hasSeenZoomAlert", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white rounded-lg shadow-lg border border-slate-200 p-4 animate-slide-up z-50">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Ajuster le zoom
          </h3>
          <p className="text-slate-600 text-sm mb-3">
            Si le contenu vous semble trop grand ou trop petit, vous pouvez ajuster le zoom :
          </p>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-100 rounded">Ctrl</kbd> +
              <kbd className="px-2 py-1 bg-slate-100 rounded">+</kbd> ou
              <kbd className="px-2 py-1 bg-slate-100 rounded">-</kbd> (Windows/Linux)
            </p>
            <p className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-100 rounded">⌘</kbd> +
              <kbd className="px-2 py-1 bg-slate-100 rounded">+</kbd> ou
              <kbd className="px-2 py-1 bg-slate-100 rounded">-</kbd> (Mac)
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ZoomAlert;