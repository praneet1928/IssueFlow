import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IssueItem } from "../types";
import { useNotifications } from "./NotificationContext";

type TicketContextType = {
  tickets: IssueItem[];
  history: IssueItem[];
  assignTicket: (id: string, technicianName: string) => void;
  addComment: (
  issueId: string,
  data: { text?: string; images?: string[] }
) => void;
  addTicket: (ticket: IssueItem) => void;
  removeTicket: (id: string) => void;
  resolveTicket: (id: string) => void;
  discardTicket: (id: string) => void;
  addToHistory: (ticket: IssueItem) => void;    
  raiseAgain: (ticket: IssueItem) => string;
  moveToActive: (ticket: IssueItem) => void;
  removeFromHistory: (id: string) => void;
};


const TicketContext = createContext<TicketContextType | undefined>(undefined);

const STORAGE_KEY = "@issueflow_data";

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [tickets, setTickets] = useState<IssueItem[]>([]);
const [history, setHistory] = useState<IssueItem[]>([]);
const { addNotification } = useNotifications();

    
    // 🔹 Load tickets on app start
    useEffect(() => {
  (async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      setTickets(parsed.tickets || []);
      setHistory(parsed.history || []);
    }
  })();
}, []);
    
    const removeTicket = (id: string) => {
      setTickets(prev => prev.filter(t => t.id !== id));
    };
  // 🔹 Save tickets on every change
 useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ tickets, history })
  );
}, [tickets, history]);

  const addTicket = (ticket: IssueItem) => {
 const newTicket: IssueItem = {
  ...ticket,
  status: "not started",
  createdAt: new Date().toISOString(),
};

  setTickets(prev => [newTicket, ...prev]);

  addNotification(
    "issue_created",
    newTicket.id,
    newTicket.code
  );
};
const removeFromHistory = (id: string) => {
  setHistory(prev => prev.filter(ticket => ticket.id !== id));
};
const raiseAgain = (oldTicket: IssueItem) => {
  const newTicket: IssueItem = {
    ...oldTicket,

    // 🔥 generate new identity
    id: Date.now().toString(),
    code: `#AD${Math.floor(100 + Math.random() * 900)}`,

    // 🔥 reset lifecycle
    status: "not started",
    createdAt: new Date().toISOString(),
    assignedTo: undefined,
    assignedAt: undefined,
    completedAt: undefined,
    discardedAt: undefined,

    // 🔥 clear comments & timeline
    comments: [],
  };

  setTickets(prev => [newTicket, ...prev]);

  return newTicket.id; // so you can navigate
};
const resolveTicket = (id: string) => {
  
  setTickets(prev => {
    const ticket = prev.find(t => t.id === id);

    if (ticket) {
      addNotification("resolved", ticket.id, ticket.code);
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

const discardTicket = (id: string) => {
  setTickets(prev => {
    const ticket = prev.find(t => t.id === id);

    if (ticket) {
      setHistory(h => [
        ...h,
        {
          ...ticket,
          status: "discarded",
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

  const ticket = tickets.find(t => t.id === id);

  if (ticket) {
    addNotification("assigned", ticket.id, ticket.code);
  }
};
const addComment = (
  issueId: string,
  data: { text?: string; images?: string[] }
) => {
  setTickets(prev =>
    prev.map(ticket =>
      ticket.id === issueId
        ? {
            ...ticket,
            comments: [
              ...(ticket.comments || []),
              {
                id: Date.now().toString(),
                text: data.text,
                images: data.images || [],
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : ticket
    )
  );
  const ticket = tickets.find(t => t.id === issueId);

if (ticket) {
  addNotification("comment", ticket.id, ticket.code);
}
};


return (
   <TicketContext.Provider value={{
  tickets,
  history,
  assignTicket,
  addComment,
  addTicket,
  removeTicket,
  raiseAgain,
  resolveTicket,
  addToHistory,
  discardTicket,
  moveToActive,
  removeFromHistory, 
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
