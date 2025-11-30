// components/Modal.tsx
"use client";

import { ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
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
      <div className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl bg-slate-900 text-slate-50 shadow-2xl">
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
