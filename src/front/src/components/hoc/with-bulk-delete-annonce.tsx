"use client";

import { ComponentType, useState } from "react";
import { Checkbox } from "@/components/atoms/checkbox";
import { Button } from "@/components/atoms/button";
import { useApplications } from "@/hooks/useApplications";
import { useAnnouncements } from "@/hooks/useAnnouncements";

export interface MultiTabBulkDeleteProps {
  selectedIds: Map<string, Set<string | number>>;
  onSelectItem: (tab: string, id: string | number) => void;
  onSelectAll: (tab: string, ids: (string | number)[]) => void;
  onClearSelection: () => void;
  onDelete: () => void;
  isDeleteMode: boolean;
  BulkActionBar: ComponentType<{ resource: string }>;
  SelectableCheckbox: ComponentType<{ resource: string; id: string | number; isSelected: boolean }>;
  SelectAllCheckbox: ComponentType<{ resource: string; allIds: (string | number)[] }>;
}

export interface BulkDeleteResult {
  successfulIds: (string | number)[];
  failedIds: (string | number)[];
  errors: { id: string | number; error: any }[];
}

// Updated context type
interface DeleteContext {
  refetchApplications: () => void;
  refetchAnnouncements: () => void;
//   deleteApplication: (id: string) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
}

interface DeleteHandler {
  onDelete: (ids: (string | number)[], context: DeleteContext) => Promise<void>;
  messageSuccess: string;
}

export interface WithMultiTabBulkDeleteOptions {
  deleteHandlers: Record<string, DeleteHandler>;
  confirmMessages: Record<string, string>;
  defaultResource?: string;
}

export function withMultiTabBulkDelete(
  options: WithMultiTabBulkDeleteOptions
) {
  return function <P extends object>(Component: ComponentType<P & MultiTabBulkDeleteProps>) {
    return function WithMultiTabBulkDeleteWrapper(props: P) {
      const [selectedIds, setSelectedIds] = useState<Map<string, Set<string | number>>>(
        new Map()
      );
      const [isDeleting, setIsDeleting] = useState(false);

      const { deleteHandlers, confirmMessages, defaultResource } = options;

      // Get hooks data - these will be passed to delete handlers
      const { refetch: refetchApplications } = useApplications();
      const { refetch: refetchAnnouncements, deleteAnnouncement } = useAnnouncements();

      const handleSelectItem = (resource: string, id: string | number) => {
        setSelectedIds((prev) => {
          const newMap = new Map(prev);
          const currentSet = newMap.get(resource) || new Set();
          const newSet = new Set(currentSet);

          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }

          if (newSet.size === 0) {
            newMap.delete(resource);
          } else {
            newMap.set(resource, newSet);
          }

          return newMap;
        });
      };

      const handleSelectAll = (resource: string, ids: (string | number)[]) => {
        setSelectedIds((prev) => {
          const newMap = new Map(prev);
          const currentSet = newMap.get(resource) || new Set();

          if (currentSet.size === ids.length) {
            newMap.delete(resource);
          } else {
            newMap.set(resource, new Set(ids));
          }

          return newMap;
        });
      };

      const handleClearSelection = () => {
        setSelectedIds(new Map());
      };

      const getCurrentResource = (): string => {
        const resources = Array.from(selectedIds.keys());
        return resources[0] || defaultResource || "";
      };

      const handleDelete = async () => {
        const currentResource = getCurrentResource();
        const idsToDelete = Array.from(selectedIds.get(currentResource) || []);

        if (idsToDelete.length === 0) return;

        const confirmMessage = confirmMessages[currentResource] || 
          "Êtes-vous sûr de vouloir supprimer les éléments sélectionnés?";
        
        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) return;

        const handler = deleteHandlers[currentResource];
        if (!handler) {
          console.error(`No delete handler found for resource: ${currentResource}`);
          return;
        }

        try {
          setIsDeleting(true);
          
          // Create context object with all necessary functions
          const context: DeleteContext = {
            refetchApplications,
            refetchAnnouncements,
            // deleteApplication,
            deleteAnnouncement,
          };

          await handler.onDelete(idsToDelete, context);

          // Clear selection after successful delete
          handleClearSelection();
        } catch (error) {
          console.error("Bulk delete operation failed:", error);
          // Error handling is done in the delete handlers themselves
        } finally {
          setIsDeleting(false);
        }
      };

      const BulkActionBar = ({ resource }: { resource: string }) => {
        const selectedCount = selectedIds.get(resource)?.size || 0;
        
        if (selectedCount === 0) return null;

        return (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full shadow-lg px-6 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
            <span className="font-medium">
              {selectedCount} élément{selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleClearSelection}
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                className="bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-white mr-2"
                >
                  <path
                    d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isDeleting ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </div>
        );
      };

      const SelectableCheckbox = ({
        resource,
        id,
        isSelected,
      }: {
        resource: string;
        id: string | number;
        isSelected: boolean;
      }) => (
        <Checkbox
          checked={isSelected}
          onChange={() => handleSelectItem(resource, id)}
          className="border-2 cursor-pointer"
        />
      );

      const SelectAllCheckbox = ({
        resource,
        allIds,
      }: {
        resource: string;
        allIds: (string | number)[];
      }) => {
        const selectedCount = selectedIds.get(resource)?.size || 0;
        const isAllSelected = selectedCount === allIds.length && allIds.length > 0;

        return (
          <Checkbox
            checked={isAllSelected}
            onChange={() => handleSelectAll(resource, allIds)}
            className="border-2 cursor-pointer"
          />
        );
      };

      return (
        <Component
          {...props}
          selectedIds={selectedIds}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onDelete={handleDelete}
          isDeleteMode={selectedIds.size > 0}
          BulkActionBar={BulkActionBar}
          SelectableCheckbox={SelectableCheckbox}
          SelectAllCheckbox={SelectAllCheckbox}
        />
      );
    };
  };
}