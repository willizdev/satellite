"use client";

import { Info } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";

type Toast = {
    id: number;
    message: string;
    visible: boolean;
};

type ToastContextType = {
    showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error();
    return context;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, visible: false }]);

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((toast) => (toast.id === id ? { ...toast, visible: true } : toast))
            );
        }, 10);

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((toast) => (toast.id === id ? { ...toast, visible: false } : toast))
            );
            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, 500);
        }, 10000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-5 right-5 z-50 space-y-3 w-[350px]">
                {toasts.map(({ id, message, visible }) => (
                    <div
                        key={id}
                        className={`flex items-center gap-3 px-4 py-3 rounded shadow-lg text-white bg-[#4DA6FF] max-w-[90vw] transition-all duration-500 ${
                            visible ? "opacity-100 -translate-x-2" : "opacity-0 translate-x-0"
                        }`}
                    >
                        <Info className="w-5 flex-shrink-0" />
                        <p className="text-base break-word whitespace-normal">{message}</p>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
