"use client";

import React, { useEffect, useState } from "react";
import { Page } from "@/shared/ui/templates/page";

// Entities & Types
import { MessagesDTO } from "@/entities/messages";
import { UserDTO } from "@/entities/user";

// Widgets & Features
import { AuthLayout } from "@/widgets/auth-layout/ui";
import { LoginForm, RegisterForm } from "@/features/auth/ui";
import { Sidebar } from "@/widgets/sidebar/ui";
import { ChatWindow } from "@/widgets/chat-window/ui";

// Stores
import { useChatsStore } from "@/state/chats";
import { useMessagesStore } from "@/state/messages";
import { useUserStore } from "@state";

export const HomePage = () => {
    // 1. User Store
    const { user, setUser, clearUser } = useUserStore();

    // 2. Chats Store
    const {
        chats,
        activeChatId,
        isLoading: isChatsLoading,
        fetchChats,
        createNewChat,
        selectChat,
        deleteChatById,
        updateChatTitle,
        reset: resetChats
    } = useChatsStore();

    // 3. Messages Store
    const {
        messages,
        isLoading: isMessagesLoading,
        fetchMessages,
        sendMessage,
        clearMessages
    } = useMessagesStore();

    // Local State
    const [authView, setAuthView] = useState<"login" | "register">("login");

    // --- EFFECTS ---

    // 1. Загрузка чатов
    useEffect(() => {
        if (user) {
            fetchChats();
        }
    }, [user, fetchChats]);

    // 2. Загрузка сообщений при смене чата
    useEffect(() => {
        if (activeChatId) {
            fetchMessages(activeChatId);
        } else {
            clearMessages();
        }
    }, [activeChatId, fetchMessages, clearMessages]);

    // --- HANDLERS ---

    const handleAuthSuccess = (loggedInUser: UserDTO) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        clearUser();
        resetChats();
        clearMessages();
        setAuthView("login");
    };

    // ОБНОВЛЕННАЯ ЛОГИКА ОТПРАВКИ
    const handleSendMessage = async (input: string | MessagesDTO) => {
        const content = typeof input === "string" ? input : input.content;

        let targetChatId = activeChatId;

        // Если чат не выбран — создаем новый
        if (!targetChatId) {
            // Генерируем название из первых 30 символов сообщения
            const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");

            // createNewChat теперь возвращает ID (см. изменения в chats.store.ts)
            const newChatId = await createNewChat(title);

            if (newChatId) {
                targetChatId = newChatId;
                // createNewChat в сторе уже делает setActiveChatId(newChatId),
                // поэтому useEffect сработает и подгрузит (пустой) список сообщений,
                // но нам не нужно ждать useEffect, чтобы отправить сообщение.
            } else {
                // Если создать не удалось (ошибка сети), прерываем
                return;
            }
        }

        // Отправляем сообщение в целевой чат
        if (targetChatId) {
            await sendMessage(targetChatId, content);
        }
    };

    // --- RENDER ---

    if (!user) {
        const isLogin = authView === "login";
        return (
            <AuthLayout
                title={isLogin ? "Авторизация" : "Регистрация"}
                onBack={() => {}}
                footerLink={
                    isLogin ? (
                        <>
                            Нет аккаунта?{" "}
                            <button
                                onClick={() => setAuthView("register")}
                                className="text-primary hover:underline font-medium"
                            >
                                Зарегистрироваться
                            </button>
                        </>
                    ) : (
                        <>
                            Есть аккаунт?{" "}
                            <button
                                onClick={() => setAuthView("login")}
                                className="text-primary hover:underline font-medium"
                            >
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

    return (
        <Page
            Sidebar={
                <Sidebar
                    chats={chats}
                    activeChatId={activeChatId}
                    user={user}
                    isLoading={isChatsLoading}
                    onNewChat={() => createNewChat()} // Кнопка "Новый чат" создает с дефолтным названием
                    onSelectChat={selectChat}
                    onEditChat={updateChatTitle}
                    onDeleteChat={deleteChatById}
                    onLogout={handleLogout}
                    className="h-full border-r border-sidebar-border bg-sidebar"
                />
            }
            Main={
                <ChatWindow
                    // Если чат не выбран, передаем пустую строку.
                    // Теперь это штатная ситуация для "Нового чата" перед первым сообщением
                    chatId={activeChatId || ""}
                    chatTitle={chats.find((c) => c.id === activeChatId)?.title}
                    messages={messages}
                    isLoading={isMessagesLoading}
                    onNewMessage={handleSendMessage}
                />
            }
        />
    );
};