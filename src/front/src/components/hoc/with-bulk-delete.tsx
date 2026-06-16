"use client";

import { ComponentType, useState } from "react";
import { Checkbox } from "@/components/atoms/checkbox";
import { Button } from "@/components/atoms/button";

export interface BulkDeleteProps {
  selectedIds: Set<string | number>;
  onSelectItem: (id: string | number) => void;
  onSelectAll: (ids: (string | number)[]) => void;
  onClearSelection: () => void;
  onDelete: () => void;
  isDeleteMode: boolean;
  BulkActionBar: ComponentType;
  SelectableCheckbox: ComponentType<{ id: string | number; isSelected: boolean }>;
  SelectAllCheckbox: ComponentType<{ allIds: (string | number)[] }>;
}

export interface BulkDeleteResult {
  successfulIds: (string | number)[];
  failedIds: (string | number)[];
  errors: { id: string | number; error: any }[];
}

// Add this new interface for store methods
interface StoreUpdateMethods {
  refreshContracts: ( ) => void;
  refreshTenants: ( ) => void;
  removeVilla: (id: string ) => void;
  removeTenant: (id: string ) => void;
  removeLocal: (id: string ) => void;
  removeBuilding: (id: string ) => void;
  // Add other store methods as needed
}

type StoreType = {
  // Add minimum required store methods/properties
  [key: string]: any;
};

export interface WithBulkDeleteOptions {
  onDeleteItems: (ids: (string | number)[]) => Promise<BulkDeleteResult>;
  confirmMessage?: string;
  onSuccess?: (result: BulkDeleteResult, storeMethods: Partial<StoreUpdateMethods>) => void;
  onError?: (error: Error, failedIds: (string | number)[]) => void;
  allowPartialSuccess?: boolean;
  storeMethods: Partial<StoreUpdateMethods>; // Pass only the methods needed
}

export function withBulkDelete<P extends object>(
  options: WithBulkDeleteOptions
) {
  return function (Component: ComponentType<P & BulkDeleteProps>) {
    return function WithBulkDeleteWrapper(props: P ) {
      const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
       const [isDeleting, setIsDeleting] = useState(false);
      
      const {
        onDeleteItems,
        confirmMessage = "Êtes-vous sûr de vouloir supprimer les éléments sélectionnés?",
        onSuccess,
        onError,
        allowPartialSuccess = false,
        storeMethods
      } = options;

      const handleSelectItem = (id: string | number) => {
        setSelectedIds((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return newSet;
        });
      };

      const handleSelectAll = (ids: (string | number)[]) => {
        if (selectedIds.size === ids.length) {
          setSelectedIds(new Set());
        } else {
          setSelectedIds(new Set(ids));
        }
      };

      const handleClearSelection = () => {
        setSelectedIds(new Set());
      };

      const handleDelete = async () => {
                      console.log(storeMethods)

        if (selectedIds.size === 0) return;

        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) return;

        const idsToDelete = Array.from(selectedIds);
        
        try {
           setIsDeleting(true);
          
          if (allowPartialSuccess) {
            const results = await Promise.allSettled(
              idsToDelete.map(async (id) => {
                try {
                  const result = await onDeleteItems([id]);
                  return { id, success: true, result };
                } catch (error) {
                  return { id, success: false, error };
                }
              })
            );

            const bulkResult: BulkDeleteResult = {
              successfulIds: [],
              failedIds: [],
              errors: []
            };

            results.forEach((result) => {
              if (result.status === 'fulfilled' && result.value.success) {
                bulkResult.successfulIds.push(result.value.id);
              } else if (result.status === 'fulfilled') {
                bulkResult.failedIds.push(result.value.id);
                bulkResult.errors.push({
                  id: result.value.id,
                  error: result.value.error
                });
              } else {
                const id = idsToDelete[results.indexOf(result)];
                bulkResult.failedIds.push(id);
                bulkResult.errors.push({
                  id,
                  error: result.reason
                });
              }
            });

            if (bulkResult.successfulIds.length > 0) {
              onSuccess?.(bulkResult,storeMethods);
            }

            if (bulkResult.failedIds.length > 0) {
              onError?.(
                new Error(`Failed to delete ${bulkResult.failedIds.length} items`),
                bulkResult.failedIds
              );
            }
          } else {
             const result = await onDeleteItems(idsToDelete);
            if (result.successfulIds.length > 0) {
              onSuccess?.(result, storeMethods);
            }
            if (result.failedIds.length > 0) {
              onError?.(
                new Error(`Failed to delete ${result.failedIds.length} items`),
                result.failedIds
              );
            }
          }
        } catch (error) {
          console.error("Bulk delete operation failed:", error);
          onError?.(
            error instanceof Error ? error : new Error("Bulk delete failed"),
            idsToDelete
          );
        } finally {
           setIsDeleting(false);
          setSelectedIds(new Set());
        }
      };

          const BulkActionBar = () => {
        if (selectedIds.size === 0) return null;

        return (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full shadow-lg px-6 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
            <span className="font-medium">
              {selectedIds.size} élément{selectedIds.size > 1 ? "s" : ""} sélectionné{selectedIds.size > 1 ? "s" : ""}
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
                Supprimer
              </Button>
            </div>
          </div>
        );
      };

      const SelectableCheckbox = ({ id, isSelected }: { id: string | number; isSelected: boolean }) => (
        <Checkbox
          checked={isSelected}
          onChange={() => handleSelectItem(id)}
          className="border-2 cursor-pointer"
        />
      );

      const SelectAllCheckbox = ({ allIds }: { allIds: (string | number)[] }) => (
        <Checkbox
          checked={selectedIds.size === allIds.length && allIds.length > 0}
          onChange={() => handleSelectAll(allIds)}
          className="border-2 cursor-pointer"
        />
      );

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