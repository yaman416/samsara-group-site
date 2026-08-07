// components/Modal.tsx
"use client";

import { ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export default function Modal({ open, onClose, children, wide = false }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-3">
      <div
        className={`relative w-full max-h-[88vh] overflow-y-auto rounded-3xl bg-slate-900 text-slate-50 shadow-2xl ${
          wide ? "max-w-6xl" : "max-w-lg"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-slate-700/70 px-3 py-1 text-xs font-medium hover:bg-slate-600"
        >
          Close
        </button>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
