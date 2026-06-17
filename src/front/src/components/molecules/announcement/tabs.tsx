"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
    className?: string;
    onTabChange?: (value: string) => void;
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

const TabsContext = React.createContext<{
    activeTab: string;
    setActiveTab: (value: string) => void;
}>({
    activeTab: "",
    setActiveTab: () => {},
});

export function Tabs({ defaultValue, children, className = "", onTabChange }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultValue);
    const previousTabRef = useRef(activeTab);

    // Use useCallback to memoize the callback
    const memoizedOnTabChange = useCallback(onTabChange || (() => {}), [onTabChange]);

    // Only trigger callback when tab actually changes
    useEffect(() => {
        if (previousTabRef.current !== activeTab) {
            memoizedOnTabChange(activeTab);
            previousTabRef.current = activeTab;
        }
    }, [activeTab, memoizedOnTabChange]);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className = "" }: TabsListProps) {
    return (
        <div className={`flex space-x-1 bg-gray-100 p-1 rounded-lg ${className}`}>
            {children}
        </div>
    );
}

export function TabsTrigger({ value, children, className = "", onClick }: TabsTriggerProps) {
    const { activeTab, setActiveTab } = React.useContext(TabsContext);
    const isActive = activeTab === value;

    const handleClick = () => {
        setActiveTab(value);
        if (onClick) {
            onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            } ${className}`}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, children, className = "" }: TabsContentProps) {
    const { activeTab } = React.useContext(TabsContext);

    if (activeTab !== value) return null;

    return <div className={className}>{children}</div>;
}