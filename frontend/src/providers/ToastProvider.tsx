import { Toast } from "@ui5/webcomponents-react";
import { createContext, useContext, useState } from "react";

const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }: any) => {
    const [toast, setToast] = useState({
        open: false,
        message: ""
    });

    const show = (message: string) => {
        setToast({
            open: true,
            message
        });
    };

    return (
        <ToastContext.Provider value={{ show }}>
            {children}

            <Toast
                open={toast.open}
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
                placement="BottomCenter"
                style={{
                    background: "white",
                    color: "black",
                    border: "1px solid #d9d9d9",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}
            >
                {toast.message}
            </Toast>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast deve ser usado dentro de ToastProvider");
    }

    return context;
};