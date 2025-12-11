import { useState } from "react";
import {createMessage, MessagesDTO, SenderType} from "@/entities/messages";

interface UseSendMessageProps {
    chatId: string;
    onSuccess?: (message: MessagesDTO) => void;
}

export const useSendMessage = ({ chatId, onSuccess }: UseSendMessageProps) => {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!text.trim() || isLoading) return;

        setIsLoading(true);
        try {
            const response = await createMessage({
                method: "POST",
                params: { chatId },
                body: {
                    content: text,
                    sender: SenderType.USER
                }
            });

            if (response?.message) {
                setText("");
                onSuccess?.(response.message);
            }
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        text,
        setText,
        isLoading,
        handleSend
    };
};