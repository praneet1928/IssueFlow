import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IssueItem } from "../types";

type TicketContextType = {
  tickets: IssueItem[];
  history: IssueItem[];
  assignTicket: (id: string, technicianName: string) => void;
  addComment: (ticketId: string, text: string, images?: string[]) => void;
  addTicket: (ticket: IssueItem) => void;
  removeTicket: (id: string) => void;
  resolveTicket: (id: string) => void;
  addToHistory: (ticket: IssueItem) => void;    
  moveToActive: (ticket: IssueItem) => void;
};


const TicketContext = createContext<TicketContextType | undefined>(undefined);

const STORAGE_KEY = "@issueflow_tickets";

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [tickets, setTickets] = useState<IssueItem[]>([]);
const [history, setHistory] = useState<IssueItem[]>([]);


    
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
  setTickets(prev => [
    {
      ...ticket,
      status: "not started",
      createdAt: new Date().toISOString(),
    },
    ...prev,
  ]);
};

const resolveTicket = (id: string) => {
  setTickets(prev => {
    const ticket = prev.find(t => t.id === id);

    if (ticket) {
      setHistory(h => [
        ...h,
        {
          ...ticket,
          status: "completed",
          completedAt: new Date().toISOString(),
        },
      ]);
    }

    return prev.filter(t => t.id !== id);
  });
};

const addToHistory = (ticket: IssueItem) => {
  setTickets(prev => prev.filter(t => t.id !== ticket.id));
  setHistory(prev => [...prev, ticket]);
};
const moveToActive = (ticket: IssueItem) => {
  setHistory(prev => prev.filter(t => t.id !== ticket.id));
  setTickets(prev => [...prev, ticket]);
};
const assignTicket = (id: string, technicianName: string) => {
  setTickets(prev =>
    prev.map(ticket =>
      ticket.id === id
        ? {
            ...ticket,
            assignedTo: technicianName,
            assignedAt: new Date().toISOString(),
            status: "in progress",
          }
        : ticket
    )
  );
};
const addComment = (ticketId: string, text: string, images?: string[]) => {
  setTickets(prev =>
    prev.map(ticket =>
      ticket.id === ticketId
        ? {
            ...ticket,
            comments: [
              ...(ticket.comments || []),
              {
                id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                text,
                images,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : ticket
    )
  );
};

return (
   <TicketContext.Provider value={{
  tickets,
  history,
  assignTicket,
  addComment,
  addTicket,
  removeTicket,
  resolveTicket,
  addToHistory,
  moveToActive,
}}>
    {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used inside TicketProvider");
  return ctx;
};
