"use client";

import NotificationCard from "@/components/molecules/notification-card";
import useNotifications from "@/hooks/useNotifications";
import { useNotificationsStore } from "@/store/notifications";
import { useAuthStore } from "@/store/auth";
import { useMemo, useState } from "react";
import { Search, Bell, ChevronDown, ChevronUp } from "lucide-react";

export default function NotificationPage() {
  useNotifications();
  const { notifications } = useNotificationsStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filtered = useMemo(() => {
    let list = notifications.filter((n) => n.recipientId === user?.id && !n.read);
    if (search) { const q = search.toLowerCase(); list = list.filter((n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)); }
    return list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [notifications, search, user]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-8 space-y-8">
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">Centre de notifications</p>
        <h1 className="text-3xl font-bold text-black">Notifications</h1>
        <p className="text-black/40 text-sm mt-2">{filtered.length} notification{filtered.length > 1 ? "s" : ""} non lue{filtered.length > 1 ? "s" : ""}</p>
      </div>

      <button onClick={() => setShowSearch(!showSearch)} className="flex items-center gap-2 text-sm text-black/40 hover:text-black/60">{showSearch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}Rechercher</button>
      {showSearch && (
        <div className="relative max-w-md"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" /><input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" /></div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20"><Bell className="w-12 h-12 text-black/10 mx-auto mb-3" /><p className="text-black/40 font-medium">Aucune notification</p><p className="text-black/20 text-sm mt-1">Les notifications apparaitront ici</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (<NotificationCard key={n.id} data={n} />))}
        </div>
      )}
    </div>
  );
}
