"use client";

import { ComponentType, useState, useEffect } from "react";
import { Checkbox } from "@/components/atoms/checkbox";
import { Button } from "@/components/atoms/button";
import { toast } from "react-toastify";
import { propertyProvider } from "@/api/properties";
import { usePropertiesStore } from "@/store/properties";

type Ressource = "villa" | "appartments" | "buildings" | "locals" | "payments";



export interface MultiTabBulkDeleteProps {
  // Selection management
  selectedIds: Map<Ressource, Set<string | number>>;
  onSelectItem: (resource: Ressource, id: string | number) => void;
  onSelectAll: (resource: Ressource, ids: (string | number)[]) => void;
  onClearSelection: (resource?: Ressource) => void;
  
  // Actions
  onDelete: (resource: Ressource) => Promise<void>;
  isDeleteMode: (resource: Ressource) => boolean;
  
  // Components
  BulkActionBar: ComponentType<{ resource: Ressource }>;
  SelectableCheckbox: ComponentType<{ 
    resource: Ressource; 
    id: string | number; 
    isSelected: boolean 
  }>;
  SelectAllCheckbox: ComponentType<{ 
    resource: Ressource; 
    allIds: (string | number)[] 
  }>;
}

interface ResourceDeleteHandlers {
  appartments: {
    onDelete: (ids: (string | number)[], storeMethods: StoreUpdateMethods) => Promise<void>;
    messageSuccess?: string;
  };
  villa: {
    onDelete: (ids: (string | number)[], storeMethods: StoreUpdateMethods) => Promise<void>;
    messageSuccess?: string;
  };
  locals: {
    onDelete: (ids: (string | number)[], storeMethods: StoreUpdateMethods) => Promise<void>;
    messageSuccess?: string;
  };
  payments: {
    onDelete: (ids: (string | number)[], storeMethods: StoreUpdateMethods) => Promise<void>;
    messageSuccess?: string;
  };
  buildings?: {
    onDelete: (ids: (string | number)[], storeMethods: StoreUpdateMethods) => Promise<void>;
    messageSuccess?: string;
  };
}

// Add this new interface for store methods
interface StoreUpdateMethods {
  removeAppartment: (id: string ) => void;
  removeVilla: (id: string ) => void;
  removeLocal: (id: string ) => void;
  removeBuilding: (id: string ) => void;
  // Add other store methods as needed
}

export interface WithMultiTabBulkDeleteOptions {
  deleteHandlers: ResourceDeleteHandlers;
  confirmMessages?: {
    [key in Ressource]?: string;
  };
  defaultResource?: Ressource;
}

export function withMultiTabBulkDelete<P extends object>(
  options: WithMultiTabBulkDeleteOptions
) {
  return function (Component: ComponentType<P & MultiTabBulkDeleteProps>) {
    return function WithMultiTabBulkDeleteWrapper(props: P & { currentTap?: Ressource }) {
      // Extract current tab from props or use default
      const currentTap = props.currentTap || options.defaultResource || "appartments";
      
      // Maintain selection state per resource type
      const [selectedIds, setSelectedIds] = useState<Map<Ressource, Set<string | number>>>(
        new Map([
          ["appartments", new Set()],
          ["villa", new Set()],
          ["locals", new Set()],
          ["buildings", new Set()],
          ["payments", new Set()]
        ])
      );
      
      // Track delete operation state
      const [isDeleting, setIsDeleting] = useState<boolean>(false);
      
      // Default confirm messages
      const defaultMessages = {
        appartments: "Êtes-vous sûr de vouloir supprimer les appartements sélectionnés?",
        villa: "Êtes-vous sûr de vouloir supprimer les villas sélectionnées?",
        locals: "Êtes-vous sûr de vouloir supprimer les locaux sélectionnés?",
        payments: "Êtes-vous sûr de vouloir supprimer les paiements sélectionnés?",
        buildings: "Êtes-vous sûr de vouloir supprimer les immeubles sélectionnés?"
      };

      // Merge default and custom confirm messages
      const confirmMessages = {
        ...defaultMessages,
        ...(options.confirmMessages || {})
      };

      // Selection handlers
      const handleSelectItem = (resource: Ressource, id: string | number) => {
        setSelectedIds((prev) => {
          const newMap = new Map(prev);
          const resourceSet = new Set(prev.get(resource) || []);
          
          if (resourceSet.has(id)) {
            resourceSet.delete(id);
          } else {
            resourceSet.add(id);
          }
          
          newMap.set(resource, resourceSet);
          return newMap;
        });
      };

      const handleSelectAll = (resource: Ressource, ids: (string | number)[]) => {
        setSelectedIds((prev) => {
          const newMap = new Map(prev);
          const currentSet = prev.get(resource) || new Set();
          
          // If all are already selected, clear selection
          if (ids.length > 0 && ids.every(id => currentSet.has(id)) && ids.length === currentSet.size) {
            newMap.set(resource, new Set());
          } else {
            // Otherwise select all
            newMap.set(resource, new Set(ids));
          }
          
          return newMap;
        });
      };

      const handleClearSelection = (resource?: Ressource) => {
        if (resource) {
          // Clear specific resource selection
          setSelectedIds((prev) => {
            const newMap = new Map(prev);
            newMap.set(resource, new Set());
            return newMap;
          });
        } else {
          // Clear all selections
          setSelectedIds(new Map([
            ["appartments", new Set()],
            ["villa", new Set()],
            ["locals", new Set()],
            ["buildings", new Set()],
            ["payments", new Set()]
          ]));
        }
      };

       // Add store methods hook
      const {
        removeAppartment,
        removeVilla,
        removeLocal,
        removeBuilding
      } = usePropertiesStore();

      // Combine store methods
      const storeMethods: StoreUpdateMethods = {
        removeAppartment,
        removeVilla,
        removeLocal,
        removeBuilding
      };

      // Modify the delete handler
      const handleDelete = async (resource: Ressource) => {
        const ids = Array.from(selectedIds.get(resource) || []);
        
        if (ids.length === 0) return;

        const handler = options.deleteHandlers[resource];
        if (!handler) {
          console.error(`No delete handler found for resource type: ${resource}`);
          toast.error("Erreur: Configuration de suppression incomplète");
          return;
        }

        const confirmed = window.confirm(confirmMessages[resource]);
        if (!confirmed) return;

        try {
          setIsDeleting(true);
          // Pass store methods to handler
          await handler.onDelete(ids, storeMethods);
          
          handleClearSelection(resource);
          
          toast.success(
            handler.messageSuccess || 
            `${ids.length} élément${ids.length > 1 ? 's' : ''} supprimé${ids.length > 1 ? 's' : ''} avec succès`
          );
        } catch (error) {
          console.error(`Error deleting ${resource}:`, error);
          toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
        } finally {
          setIsDeleting(false);
        }
      };

      // Check if we're in delete mode for a specific resource
      const isDeleteMode = (resource: Ressource) => {
        return (selectedIds.get(resource)?.size || 0) > 0;
      };

      // Components
      const SelectableCheckbox = ({ 
        resource, 
        id, 
        isSelected 
      }: { 
        resource: Ressource; 
        id: string | number; 
        isSelected: boolean 
      }) => (
        <Checkbox
          checked={isSelected}
          onChange={() => handleSelectItem(resource, id)}
          className="border-2"
          disabled={isDeleting}
        />
      );

      const SelectAllCheckbox = ({ 
        resource, 
        allIds 
      }: { 
        resource: Ressource; 
        allIds: (string | number)[] 
      }) => {
        const resourceSelection = selectedIds.get(resource) || new Set();
        const isAllSelected = 
          allIds.length > 0 && 
          allIds.every(id => resourceSelection.has(id)) &&
          allIds.length === resourceSelection.size;
          
        return (
          <Checkbox
            checked={isAllSelected}
            onChange={() => handleSelectAll(resource, allIds)}
            className="border-2"
            disabled={allIds.length === 0 || isDeleting}
          />
        );
      };

      const BulkActionBar = ({ resource }: { resource: Ressource }) => {
        const resourceSelection = selectedIds.get(resource) || new Set();
        
        if (resourceSelection.size === 0) return null;

        return (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full shadow-lg px-6 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
            <span className="font-medium">
              {resourceSelection.size} élément{resourceSelection.size > 1 ? "s" : ""} sélectionné{resourceSelection.size > 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleClearSelection(resource)}
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                onClick={() => handleDelete(resource)}
                variant="destructive"
                size="sm"
                className="bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <svg 
                      className="animate-spin h-4 w-4 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Suppression...
                  </div>
                ) : (
                  <>
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
                    Supprimer
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      };

      // When current tab changes, reset the delete operation status
      useEffect(() => {
        if (isDeleting) {
          setIsDeleting(false);
        }
      }, [currentTap]);

      return (
        <Component
          {...props as P}
          selectedIds={selectedIds}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onDelete={handleDelete}
          isDeleteMode={isDeleteMode}
          BulkActionBar={BulkActionBar}
          SelectableCheckbox={SelectableCheckbox}
          SelectAllCheckbox={SelectAllCheckbox}
        />
      );
    };
  };
}