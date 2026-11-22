"use client";
import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

// same props as before, now a frosted-glass pop-up built on the shadcn/ui Dialog
export default function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[90vh] gap-5 overflow-y-auto rounded-3xl bg-white/90 p-6 pt-8 shadow-[0_30px_80px_-20px_rgb(15_30_74/0.55)] ring-1 ring-white/70 backdrop-blur-xl sm:max-w-lg dark:bg-[#111b45]/95 dark:ring-white/10">
        {/* thin gradient strip along the top edge */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-[image:var(--grad-brand)]" />
        <DialogHeader>
          <DialogTitle className="pr-8 text-xl font-extrabold text-[var(--navy)]">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}