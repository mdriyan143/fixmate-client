"use client";
import Modal from "./Modal";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  text: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ open, title, text, confirmText = "Yes, continue", onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="mb-6 text-slate-600">{text}</p>
      <div className="flex justify-end gap-3">
        <button className="btn-ghost" onClick={onCancel}>No, go back</button>
        <button className="btn-danger" onClick={onConfirm}>{confirmText}</button>
      </div>
    </Modal>
  );
}
