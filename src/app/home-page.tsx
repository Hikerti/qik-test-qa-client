"use client";

import React, { useEffect, useState } from "react";
import { Page } from "@/shared/ui/templates/page";
import { ChatsDTO, getChatsByChatList } from "@/entities/chats"; // Предполагаем, что api экспортировано
import { MessagesDTO, getMessagesByChatList } from "@/entities/messages";
import { UserDTO, getAuthorizedUser, UserTheme } from "@/entities/user";
import {Sidebar} from "@/widgets/sidebar/ui";
import {ChatWindow} from "@/widgets/chat-window/ui";

const MOCK_USER: UserDTO = {
    id: "1",
    name: "User",
    email: "user@qik.ai",
    theme: UserTheme.light,
    lastSentAt: new Date(),
    createdAt: new Date(),
};

export const HomePage = () => {
    const [user, setUser] = useState<UserDTO>(MOCK_USER);
    const [chats, setChats] = useState<ChatsDTO[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
    const [messages, setMessages] = useState<MessagesDTO[]>([]);

    const [isChatsLoading, setIsChatsLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);

    useEffect(() => {
        const initData = async () => {
            setIsChatsLoading(true);
            try {
                setChats([
                    { id: "1", title: "Чат о React архитектуре", createdAt: new Date() },
                    { id: "2", title: "Планирование проекта", createdAt: new Date() }
                ]);
            } catch (e) {
                console.error(e);
            } finally {
                setIsChatsLoading(false);
            }
        };
        initData();
    }, []);

    useEffect(() => {
        if (!activeChatId) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            setIsMessagesLoading(true);
            try {
                setMessages([]);
            } catch (e) {
                console.error(e);
            } finally {
                setIsMessagesLoading(false);
            }
        };
        fetchMessages();
    }, [activeChatId]);

    const handleSelectChat = (id: string) => {
        setActiveChatId(id);
    };

    const handleNewChat = () => {
        setActiveChatId(undefined);
        setMessages([]);
    };

    const handleMessageSent = (newMessage: MessagesDTO) => {
        setMessages((prev) => [...prev, newMessage]);

    };

    const handleEditChat = (id: string, newTitle: string) => {
        console.log("Edit chat", id, newTitle);
    };

    const handleDeleteChat = (id: string) => {
        console.log("Delete chat", id);
        setChats(prev => prev.filter(c => c.id !== id));
        if (activeChatId === id) setActiveChatId(undefined);
    };

    const handleLogout = () => {
        console.log("Logout");
    };


    return (
        <Page
            Sidebar={
                <Sidebar
                    chats={chats}
                    activeChatId={activeChatId}
                    user={user}
                    isLoading={isChatsLoading}
                    onNewChat={handleNewChat}
                    onSelectChat={handleSelectChat}
                    onEditChat={handleEditChat}
                    onDeleteChat={handleDeleteChat}
                    onLogout={handleLogout}
                    // Важно: твой SidebarWidget должен занимать 100% высоты
                    className="h-full border-r"
                />
            }
            Main={
                <ChatWindow
                    chatId={activeChatId || "new"}
                    chatTitle={chats.find(c => c.id === activeChatId)?.title}
                    messages={messages}
                    isLoading={isMessagesLoading}
                    onNewMessage={handleMessageSent}
                />
            }
        />
    );
};