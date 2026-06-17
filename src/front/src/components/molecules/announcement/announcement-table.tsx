"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/molecules/table";
import { Button } from "@/components/atoms/button";
import { ModalNames, useModalStore } from "@/store/modal";
import { displayDate, displayNumberWithMoneyFormat } from "@/lib/format";
import { useAnnouncements } from "@/hooks/useAnnouncements";

interface AnnouncementsTableProps {
    announcements: any[];
    onRefresh: () => void;
    // Bulk delete props
    selectedIds?: Set<string | number>;
    SelectableCheckbox?: React.ComponentType<{ id: string | number; isSelected: boolean }>;
    SelectAllCheckbox?: React.ComponentType<{ allIds: (string | number)[] }>;
}

export function AnnouncementsTable({ 
    announcements, 
    onRefresh,
    selectedIds,
    SelectableCheckbox,
    SelectAllCheckbox
}: AnnouncementsTableProps) {
    const { toggle } = useModalStore();
    const { deleteAnnouncement } = useAnnouncements();

    const handleDelete = (announcement: any) => {
        toggle({
            name: ModalNames.CONFIRM_DELETE,
            data: {
                title: "Supprimer l'annonce",
                itemName: announcement.title || "cette annonce",
                description: `Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.`,
                onConfirm: async () => {
                    await deleteAnnouncement(announcement.id);
                    onRefresh();
                }
            }
        });
    };

    const handleEdit = (announcement: any) => {
        toggle({
            name: ModalNames.EDIT_ANNOUNCEMENT,
            data: { 
                announcement,
                onRefresh 
            }
        });
    };

    const showBulkActions = SelectableCheckbox && SelectAllCheckbox && selectedIds;

    return (
        <div className='w-full bg-background rounded-2xl p-4'>
            <Table className='min-w-[1000px] overflow-auto'>
                <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                        {showBulkActions && (
                            <TableHead className="w-[50px]">
                                <SelectAllCheckbox allIds={announcements?.map(a => a.id) ?? []} />
                            </TableHead>
                        )}
                        <TableHead className='w-[250px]'>Titre</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Date de création</TableHead>
                        <TableHead className='text-left'>Statut du mobilier</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {announcements?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={showBulkActions ? 7 : 6} className="text-center py-6">
                                <div className="flex flex-col items-center justify-center">
                                    <svg 
                                        width="48" 
                                        height="48" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-gray-400 mb-2"
                                    >
                                        <path 
                                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
                                            strokeWidth="1.5" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <p className="text-gray-500 font-medium">Aucune annonce disponible</p>
                                    <p className="text-sm text-gray-400">Vos annonces apparaîtront ici une fois créées</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        announcements?.map((announcement, index) => (
                            <TableRow key={announcement.id || index}>
                                {showBulkActions && (
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <SelectableCheckbox
                                            id={announcement.id}
                                            isSelected={selectedIds?.has(announcement.id) || false}
                                        />
                                    </TableCell>
                                )}
                                <TableCell className='py-4'>
                                    <div className='font-medium flex items-center gap-2'>
                                        <svg
                                            width='18'
                                            height='18'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='stroke-primary'
                                        >
                                            <path
                                                d='M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                            <path
                                                d='M8 21L16 21'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                            <path
                                                d='M12 17L12 21'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                        <span>{announcement.title || 'Sans titre'}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2'>
                                        <span className="font-medium">
                                            {announcement.price ? `${displayNumberWithMoneyFormat(Math.floor(announcement.price))} XOF` : 'N/A'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {announcement.created_at ? displayDate(announcement.created_at) : 'N/A'}
                                </TableCell>
                                <TableCell className='text-left'>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        announcement.furniture_status === "furnished" ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {announcement.furniture_status === "furnished" ? "meublé" : 'non meublé'}
                                    </span>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <div className='flex items-center justify-end gap-2'>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(announcement)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="stroke-current"
                                            >
                                                <path
                                                    d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(announcement)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="stroke-current"
                                            >
                                                <path
                                                    d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}