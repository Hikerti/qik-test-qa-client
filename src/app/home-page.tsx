"use client";

import React, { useEffect, useState } from "react";
import { Page } from "@/shared/ui/templates/page";

// Entities
import { ChatsDTO, getChatsByChatList } from "@/entities/chats";
import { MessagesDTO, getMessagesByChatList } from "@/entities/messages";
import {UserDTO, getAuthorizedUser, UserTheme, getUsersList} from "@/entities/user";
import {AuthLayout} from "@/widgets/auth-layout/ui";
import {LoginForm, RegisterForm} from "@/features/auth/ui";
import {Sidebar} from "@/widgets/sidebar/ui";
import {ChatWindow} from "@/widgets/chat-window/ui";
import {useFetcher} from "@shared";



export const HomePage = () => {
    // --- AUTH STATE ---
    const [user, setUser] = useState<UserDTO | null>(null); // По умолчанию null
    const [authView, setAuthView] = useState<"login" | "register">("register"); // По умолчанию регистрация (как на скрине)

    // --- CHAT STATE ---
    const [chats, setChats] = useState<ChatsDTO[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
    const [messages, setMessages] = useState<MessagesDTO[]>([]);

    const [isChatsLoading, setIsChatsLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);

    // const {} = useFetcher(getUsersList);

    // --- EFFECTS ---

    // 1. Загрузка чатов (только если есть User)
    useEffect(() => {
        if (!user) return; // Не грузим чаты, пока не вошли

        const initData = async () => {
            setIsChatsLoading(true);
            try {
                // Тут в будущем будет реальный запрос API
                // const { chats } = await getChatsByChatList(...);

                // MOCK DATA
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
    }, [user]);

    // 2. Загрузка сообщений при выборе чата
    useEffect(() => {
        if (!activeChatId) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            setIsMessagesLoading(true);
            try {
                // Тут в будущем запрос API по activeChatId
                setMessages([]);
            } catch (e) {
                console.error(e);
            } finally {
                setIsMessagesLoading(false);
            }
        };
        fetchMessages();
    }, [activeChatId]);

    // --- HANDLERS ---

    // Авторизация успешна
    const handleAuthSuccess = (loggedInUser: UserDTO) => {
        setUser(loggedInUser);
        // Чаты загрузятся автоматически благодаря useEffect([user])
    };

    const handleLogout = () => {
        setUser(null);
        setAuthView("login"); // При выходе показываем форму входа
        setChats([]);
        setMessages([]);
        setActiveChatId(undefined);
    };

    // Чат хендлеры
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
        // Логика обновления названия
    };

    const handleDeleteChat = (id: string) => {
        console.log("Delete chat", id);
        setChats(prev => prev.filter(c => c.id !== id));
        if (activeChatId === id) setActiveChatId(undefined);
    };

    // --- RENDER ---

    // 1. Если пользователь НЕ авторизован -> показываем экран Auth
    if (!user) {
        const isLogin = authView === "login";

        return (
            <AuthLayout
                title={isLogin ? "Авторизация" : "Регистрация"}
                onBack={() => console.log("Back clicked")} // Можно сделать редирект на лендинг
                footerLink={
                    isLogin ? (
                        <>
                            Нет аккаунта?{" "}
                            <button onClick={() => setAuthView("register")} className="text-blue-500 hover:underline">
                                Зарегистрироваться
                            </button>
                        </>
                    ) : (
                        <>
                            Есть аккаунт?{" "}
                            <button onClick={() => setAuthView("login")} className="text-blue-500 hover:underline">
                                Войти
                            </button>
                        </>
                    )
                }
            >
                {isLogin ? (
                    <LoginForm onSuccess={handleAuthSuccess} />
                ) : (
                    <RegisterForm onSuccess={handleAuthSuccess} />
                )}
            </AuthLayout>
        );
    }

    // 2. Если авторизован -> показываем Чат
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