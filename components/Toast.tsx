"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = "info", 
  duration = 3000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  const styles = {
    success: "bg-[#00A99D] text-white",
    error: "bg-red-500 text-white",
    info: "bg-[#0054A6] text-white",
    warning: "bg-[#F15A24] text-white",
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slideIn ${styles[type]} min-w-[300px] max-w-md`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-80 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;