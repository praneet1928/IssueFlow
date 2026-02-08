import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IssueItem } from "../types";

type TicketContextType = {
  tickets: IssueItem[];
  addTicket: (ticket: IssueItem) => void;
  removeTicket: (id: string) => void;
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const STORAGE_KEY = "@issueflow_tickets";

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [tickets, setTickets] = useState<IssueItem[]>([]);
    
    // 🔹 Load tickets on app start
    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) setTickets(JSON.parse(raw));
            } catch (e) {
                console.warn("Failed to load tickets", e);
            }
        })();
    }, []);
    
    const removeTicket = (id: string) => {
      setTickets(prev => prev.filter(t => t.id !== id));
    };
  // 🔹 Save tickets on every change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (ticket: IssueItem) => {
    setTickets(prev => [ticket, ...prev]);
};

return (
    <TicketContext.Provider value={{ tickets, addTicket, removeTicket }}>
    {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used inside TicketProvider");
  return ctx;
};
