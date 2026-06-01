import { MessageBox, MessageBoxType } from "@ui5/webcomponents-react";
import React, { createContext, useContext, useState, useCallback } from "react";

interface MessageBoxContextType {
    showError: (message: string) => void;
}

const MessageBoxContext = createContext<MessageBoxContextType | undefined>(undefined);

export function MessageBoxProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const showError = (message: string) => {
        setErrorMessage(message);
        setIsOpen(true);
    };

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <MessageBoxContext.Provider value={{ showError }}>
            {children}
            
            <MessageBox
                type={MessageBoxType.Error} 
                open={isOpen}               
                onClose={handleClose}
            >
                {errorMessage}
            </MessageBox>
        </MessageBoxContext.Provider>
    );
}

export function useMessageBox() {
    const context = useContext(MessageBoxContext);
    if (!context) {
        throw new Error("useMessageBox deve ser usado dentro de um MessageBoxProvider");
    }
    return context;
}