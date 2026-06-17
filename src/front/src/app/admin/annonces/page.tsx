"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreateAnnouncementForm, {
  AnnouncementFormData,
} from "@/components/organisms/announcements/create-announcement-form";
import AnnouncementsList from "@/components/organisms/announcements/announcements-list";

const API_BASE = "https://mobile-api.smkluxury.com/public/api/";

type UIAnnouncement = {
  id: string | number;
  title: string;
  subtitle?: string;
  description: string;
  type: string;
  createdAt: string;
};

export default function AnnouncementsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<UIAnnouncement[]>([]);

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}annonces`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const mapped = Array.isArray(data)
        ? data.map((item: any) => ({
            id: item.id ?? item.ID ?? item.id_annonce ?? Date.now(),
            title: item.titre || item.title || item.name || "(Sans titre)",
            subtitle: "Nouvelles mises à jour",
            description: item.description || item.texte || "",
            type: item.type || "general",
            createdAt:
              item.created_at ||
              item.createdAt ||
              new Date().toLocaleDateString("fr-FR"),
          }))
        : [];

      setAnnouncements(mapped);
    } catch (err) {
      setError("Erreur lors de la récupération des annonces");
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handlers
  const handleCreateAnnouncement = async (formData: AnnouncementFormData) => {
    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("texte", formData.texte);
      if (formData.image) payload.append("image", formData.image);

      const res = await fetch(`${API_BASE}annonces`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const created = await res.json();

      const newAnnouncement: UIAnnouncement = {
        id: created.id ?? Date.now(),
        title: created.titre || created.title || formData.title,
        subtitle: "Nouvelles mises à jour",
        description: created.description || created.texte || formData.texte,
        type: created.type || "general",
        createdAt: created.created_at || new Date().toLocaleDateString("fr-FR"),
      };

      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      toast.success("Annonce publiée avec succès!");
    } catch (err) {
      toast.error("Erreur lors de la publication de l'annonce");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: number | string) => {
    try {
      const res = await fetch(`${API_BASE}annonces/${announcementId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `HTTP ${res.status}`);
      }

      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
      toast.success("Annonce supprimée");
    } catch (err) {
      toast.error("Erreur lors de la suppression de l'annonce");
    }
  };

  const handleReadMore = (announcement: any) => {
    toast.info(`Détails de: ${announcement.title}`);
    // TODO: Implement read more modal
  };

  return (
    <section className="p-6">
      <div className="max-w-[1400px] mx-auto mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* Left Column - Create Form */}
          <aside>
            <CreateAnnouncementForm
              onSubmit={handleCreateAnnouncement}
              isLoading={isLoading}
            />
          </aside>

          {/* Right Column - Announcements List */}
          <main>
            <AnnouncementsList
              announcements={announcements}
              isLoading={loadingAnnouncements}
              error={error}
              onDelete={handleDeleteAnnouncement}
              onReadMore={handleReadMore}
            />
          </main>
        </div>
      </div>
    </section>
  );
}
