"use client";

import React, { KeyboardEvent } from "react";
import {ArrowRight, SendHorizontal} from "lucide-react";
import { MessagesDTO } from "@/entities/messages";
import {useSendMessage} from "@/features/send-message";
import { Inputs } from "@/shared/ui/Inputs";

interface SendMessageFormProps {
    chatId: string;
    onMessageSent?: (message: MessagesDTO) => void;
    className?: string;
}

export const SendMessageForm = ({ chatId, onMessageSent, className }: SendMessageFormProps) => {
    const { text, setText, isLoading, handleSend } = useSendMessage({
        chatId,
        onSuccess: onMessageSent
    });

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={className}>
            <Inputs.TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Напишите что-то тут"
                disabled={isLoading}
                wrapperClassName="shadow-sm"
                endIcon={
                    <button
                        onClick={handleSend}
                        disabled={!text.trim() || isLoading}
                        className="p-1.5 rounded-md bg-black/80 text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ArrowRight size={16} />
                    </button>
                }
            />
        </div>
    );
};