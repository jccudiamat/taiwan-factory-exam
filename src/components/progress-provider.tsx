"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { completeSession, emptyProgress, parseProgress, STORAGE_KEY, type Progress, type Session, type Attempt } from "@/lib/quiz";

import { DAILY_KEY } from "@/lib/daily-samples";

type Store = {
  data: Progress; ready: boolean; storageIssue: boolean;
  saveSession: (session: Session | null) => void;
  finish: (attempt: Attempt) => void;
  toggleBookmark: (id: string) => void;
  clear: () => void;
};
const Context = createContext<Store | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [storageIssue, setStorageIssue] = useState(false);
  const current = useRef(data);
  const memoryOnly = useRef(false);
  useEffect(() => {
    try { const stored = parseProgress(localStorage.getItem(STORAGE_KEY)); current.current = stored; setData(stored); }
    catch { memoryOnly.current=true; setStorageIssue(true); }
    setReady(true);
    function sync(event: StorageEvent) {
      if (event.key === STORAGE_KEY || event.key === null) {
        const stored = parseProgress(event.newValue); current.current = stored; setData(stored);
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const update = useCallback((change: (previous: Progress) => Progress) => {
    let previous=current.current;
    // After a failed write, older durable data must not overwrite newer in-memory answers.
    if(!memoryOnly.current)try { const raw=localStorage.getItem(STORAGE_KEY);if(raw)previous=parseProgress(raw); } catch { memoryOnly.current=true; }
    const next = change(previous);
    current.current = next; setData(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); memoryOnly.current=false; setStorageIssue(false); }
    catch { memoryOnly.current=true; setStorageIssue(true); }
  }, []);
  const saveSession = useCallback((session: Session | null) => update((p) => session&&p.attempts.some(a=>a.id===session.id)?p:({ ...p, active: session })), [update]);
  const finish = useCallback((attempt: Attempt) => update((p) => ({ ...p,
    active: p.active?.id === attempt.id ? null : p.active,
    attempts: p.attempts.some(a=>a.id===attempt.id)?p.attempts:[attempt, ...p.attempts].slice(0, 100),
  })), [update]);
  useEffect(()=>{
    if(!ready)return;
    const sweep=()=>{const active=current.current.active;if(active?.deadline&&Date.now()>=active.deadline)finish(completeSession(active,active.deadline));};
    sweep();const interval=window.setInterval(sweep,500);document.addEventListener('visibilitychange',sweep);
    return()=>{window.clearInterval(interval);document.removeEventListener('visibilitychange',sweep);};
  },[ready,finish]);
  const toggleBookmark = useCallback((id: string) => update((p) => ({ ...p, bookmarks: p.bookmarks.includes(id) ? p.bookmarks.filter((b) => b !== id) : [...p.bookmarks, id] })), [update]);
  const clear = useCallback(() => {
    current.current = { ...emptyProgress }; setData({ ...emptyProgress });
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(DAILY_KEY); localStorage.removeItem("taiwan-factory-exam:learning:v1"); memoryOnly.current=false; setStorageIssue(false); } catch { memoryOnly.current=true; setStorageIssue(true); }
  }, []);
  return <Context.Provider value={{ data, ready, storageIssue, saveSession, finish, toggleBookmark, clear }}>{children}</Context.Provider>;
}

export function useProgress() {
  const store = useContext(Context);
  if (!store) throw new Error("ProgressProvider is missing");
  return store;
}
