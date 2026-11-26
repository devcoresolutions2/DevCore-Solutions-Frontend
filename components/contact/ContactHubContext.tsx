"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ContactHubContextType {
  isOpen: boolean;
  activeChannel?: string;
  openHub: (channel?: string) => void;
  closeHub: () => void;
  toggleHub: () => void;
}

const ContactHubContext = createContext<ContactHubContextType | undefined>(undefined);

export function ContactHubProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState<string | undefined>(undefined);

  const openHub = useCallback((channel?: string) => {
    setActiveChannel(channel);
    setIsOpen(true);
  }, []);

  const closeHub = useCallback(() => {
    setIsOpen(false);
    setActiveChannel(undefined);
  }, []);

  const toggleHub = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <ContactHubContext.Provider
      value={{
        isOpen,
        activeChannel,
        openHub,
        closeHub,
        toggleHub,
      }}
    >
      {children}
    </ContactHubContext.Provider>
  );
}

export function useContactHub() {
  const context = useContext(ContactHubContext);
  if (!context) {
    throw new Error("useContactHub must be used within a ContactHubProvider");
  }
  return context;
}
