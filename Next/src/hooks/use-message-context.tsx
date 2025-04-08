"use client"
import { MessageContext } from "@/context/MessageProvider";
import { useContext } from "react";

export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessageContext must be used within a MessageProvider");
    }
    return context;
};
