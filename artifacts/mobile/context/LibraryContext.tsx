import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PLAYLISTS, Playlist } from "@/constants/mockData";

interface LibraryContextType {
  likedIds: Set<string>;
  playlists: Playlist[];
  downloads: Set<string>;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  toggleDownload: (id: string) => void;
  isDownloaded: (id: string) => boolean;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set(["s1", "s3", "s7", "s9"]));
  const [playlists, setPlaylists] = useState<Playlist[]>(PLAYLISTS);
  const [downloads, setDownloads] = useState<Set<string>>(new Set(["s1", "s2"]));

  useEffect(() => {
    AsyncStorage.getItem("@echo_liked").then(v => {
      if (v) setLikedIds(new Set(JSON.parse(v)));
    }).catch(() => {});
    AsyncStorage.getItem("@echo_downloads").then(v => {
      if (v) setDownloads(new Set(JSON.parse(v)));
    }).catch(() => {});
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      AsyncStorage.setItem("@echo_liked", JSON.stringify([...next])).catch(() => {});
      return next;
    });
  }, []);

  const isLiked = useCallback((id: string) => likedIds.has(id), [likedIds]);

  const toggleDownload = useCallback((id: string) => {
    setDownloads(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      AsyncStorage.setItem("@echo_downloads", JSON.stringify([...next])).catch(() => {});
      return next;
    });
  }, []);

  const isDownloaded = useCallback((id: string) => downloads.has(id), [downloads]);

  return (
    <LibraryContext.Provider value={{
      likedIds, playlists, downloads,
      toggleLike, isLiked,
      toggleDownload, isDownloaded,
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}
