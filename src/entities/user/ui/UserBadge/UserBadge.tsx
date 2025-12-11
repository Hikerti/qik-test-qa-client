"use client";

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { UserDTO, UserTheme } from "@entities";
import { clsx } from "clsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";

interface UserBadgeProps {
    user: UserDTO;
    className?: string;
    onLogout?: () => void;
    onThemeToggle?: (isDark: boolean) => void;
}

export const UserBadge = ({
                              user,
                              className,
                              onLogout,
                              onThemeToggle
                          }: UserBadgeProps) => {
    // Вычисляем инициалы для фоллбека
    const initials = user.name.slice(0, 2).toUpperCase();
    const isDark = user.theme === UserTheme.dark;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div
                    className={clsx(
                        "w-full flex items-center gap-3 p-2 hover:bg-accent hover:text-accent-foreground rounded-xl cursor-pointer transition-colors",
                        className
                    )}
                >
                    <Avatar className="h-8 w-8">
                        {/* Если в DTO появится аватар, добавить AvatarImage */}
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <span className="font-medium text-sm truncate flex-1 text-left">
                        {user.name}
                    </span>
                </div>
            </PopoverTrigger>

            <PopoverContent
                side="top"
                align="start"
                className="w-[260px] p-4 rounded-2xl mb-2 shadow-xl border-gray-100"
            >
                {/* Верхняя часть: Большой аватар и имя */}
                <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gray-200 text-lg text-gray-500">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="font-bold text-lg text-gray-800">
                        {user.name}
                    </div>
                </div>

                {/* Переключатель темы */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-600 font-medium">Темная тема</span>
                    <Switch
                        checked={isDark}
                        onCheckedChange={onThemeToggle}
                    />
                </div>

                {/* Кнопка выхода */}
                <Button
                    variant="destructive"
                    className="w-full bg-[#FF7575] hover:bg-[#ff5a5a] text-white rounded-xl h-10 font-medium"
                    onClick={onLogout}
                >
                    Выйти
                </Button>
            </PopoverContent>
        </Popover>
    );
};