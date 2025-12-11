import { clsx } from "clsx";
import { User, Bot } from "lucide-react";
import { MessagesDTO, SenderType } from "@entities";

interface MessageCardProps {
    message: MessagesDTO;
}

export const MessageCard = ({ message }: MessageCardProps) => {
    const isAi = message.sender === SenderType.SENDER;

    return (
        <div className={clsx(
            "group w-full text-gray-800 border-b border-black/5 dark:border-white/5",
            isAi ? "bg-[#F7F7F8]" : "bg-white" // Фон как в старых версиях ChatGPT (серый для AI), можно убрать если дизайн чисто белый
        )}>
            <div className="flex gap-4 p-4 m-auto max-w-3xl text-base md:gap-6 md:py-6">

                {/* Аватар */}
                <div className={clsx(
                    "relative flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-sm",
                    isAi ? "bg-emerald-500" : "bg-gray-400"
                )}>
                    {isAi ? (
                        <Bot className="h-5 w-5 text-white" />
                    ) : (
                        <User className="h-5 w-5 text-white" />
                    )}
                </div>

                {/* Контент */}
                <div className="relative flex-1 overflow-hidden">
                    {/* Имя отправителя (опционально, обычно в чатах нейросетей не пишут, но для отладки полезно) */}
                    <div className="font-semibold text-sm mb-1 opacity-90">
                        {isAi ? "QIK AI" : "You"}
                    </div>

                    {/* Текст сообщения */}
                    <div className="prose prose-slate max-w-none break-words whitespace-pre-wrap leading-7">
                        {message.content}
                    </div>
                </div>
            </div>
        </div>
    );
};