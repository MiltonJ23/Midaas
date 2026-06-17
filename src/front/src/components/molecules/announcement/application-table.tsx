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
import Image from "next/image";
import pngFile from "@/assets/images/icons/png-file.svg";
import { ModalNames, useModalStore } from "@/store/modal";
import { displayDate, displayHour } from "@/lib/format";

interface ApplicationsTableProps {
    applications: any[];
    onRefresh: () => void;
    // Bulk delete props
    selectedIds?: Set<string | number>;
    SelectableCheckbox?: React.ComponentType<{ id: string | number; isSelected: boolean }>;
    SelectAllCheckbox?: React.ComponentType<{ allIds: (string | number)[] }>;
}

export function ApplicationsTable({ 
    applications, 
    onRefresh,
    selectedIds,
    SelectableCheckbox,
    SelectAllCheckbox
}: ApplicationsTableProps) {
    const { toggle } = useModalStore();

    const handleValidate = (application: any) => {
        toggle({
            name: ModalNames.CONFIRM_ACTION,
            data: {
                title: "Valider la candidature",
                itemName: application.fullName || "cette candidature",
                description: `Êtes-vous sûr de vouloir valider cette candidature ?`,
                onConfirm: async () => {
                    // Implementation will come later
                    alert(`Candidature de ${application.fullName} validée!`);
                    onRefresh();
                }
            }
        });
    };

    const handleReject = (application: any) => {
        toggle({
            name: ModalNames.CONFIRM_DELETE,
            data: {
                title: "Rejeter la candidature",
                itemName: application.fullName || "cette candidature",
                description: `Êtes-vous sûr de vouloir rejeter cette candidature ? Cette action est irréversible.`,
                onConfirm: async () => {
                    // Implementation will come later
                    alert(`Candidature de ${application.fullName} rejetée!`);
                    onRefresh();
                }
            }
        });
    };

    const handleViewDetails = (application: any) => {
        toggle({
            name: ModalNames.CANDIDATURE_DETAILS,
            data: { application },
        });
    };

    // Determine if we should show bulk action checkboxes
    // const showBulkActions = SelectableCheckbox && SelectAllCheckbox && selectedIds !== undefined;
    const showBulkActions = false;

    return (
        <div className='w-full bg-background rounded-2xl p-4'>
            <Table className='min-w-[1000px] overflow-auto'>
                <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                        {/* {showBulkActions != false && (
                            <TableHead className="w-[50px]">
                                <SelectAllCheckbox allIds={applications?.map(a => a.id) ?? []} />
                            </TableHead>
                        )} */}
                        <TableHead className='w-[250px]'>Nom du candidat</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className='text-left'>Heure</TableHead>
                        <TableHead className='text-left'>Adresse</TableHead>
                        <TableHead>Pièce d&apos;identité</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={showBulkActions ? 8 : 7} className="text-center py-6">
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
                                            d="M9 17H15M9 13H15M9 9H10M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H14.5858C14.851 3 15.1054 3.10536 15.2929 3.29289L20.7071 8.70711C20.8946 8.89464 21 9.149 21 9.41421V19C21 20.1046 20.1046 21 19 21Z" 
                                            strokeWidth="1.5" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <p className="text-gray-500 font-medium">Aucune candidature disponible</p>
                                    <p className="text-sm text-gray-400">Les candidatures apparaîtront ici une fois soumises</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        applications?.map((application, index) => (
                            <TableRow key={application.id || index}>
                                {/* {showBulkActions && (
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <SelectableCheckbox
                                            id={application.id}
                                            isSelected={selectedIds?.has(application.id) || false}
                                        />
                                    </TableCell>
                                )} */}
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
                                                d='M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                            <path
                                                d='M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                        <span>{application.fullName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className='text-left'>
                                    {application.phoneNumber}
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2'>
                                        <svg
                                            width='18'
                                            height='18'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='stroke-black'
                                        >
                                            <path
                                                d='M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                        <span>{displayDate(application.createdAt)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{displayHour(application.createdAt)}</TableCell>
                                <TableCell className='text-left'>
                                    <div className='font-medium inline-flex items-center gap-2'>
                                        <svg
                                            width='24'
                                            height='24'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='stroke-black'
                                        >
                                            <path
                                                d='M17.6569 16.6569C16.7202 17.5935 14.7616 19.5521 13.4138 20.8999C12.6327 21.681 11.3677 21.6814 10.5866 20.9003C9.26234 19.576 7.34159 17.6553 6.34315 16.6569C3.21895 13.5327 3.21895 8.46734 6.34315 5.34315C9.46734 2.21895 14.5327 2.21895 17.6569 5.34315C20.781 8.46734 20.781 13.5327 17.6569 16.6569Z'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                            <path
                                                d='M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                        <span>{application.address}</span>
                                    </div>
                                </TableCell>
                                <TableCell
                                    className='cursor-pointer'
                                    onClick={() => handleViewDetails(application)}
                                >
                                    <div className='inline-flex items-center gap-2'>
                                        <Image
                                            src={pngFile}
                                            alt='png-file'
                                            width={24}
                                            height={24}
                                        />
                                        <span>Pièce d&apos;identité</span>
                                    </div>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <div className='flex items-center justify-end gap-2'>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleValidate(application)}
                                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                            title="Valider la candidature"
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
                                                    d="M5 12L10 17L20 7"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleReject(application)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            title="Rejeter la candidature"
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
                                                    d="M18 6L6 18M6 6l12 12"
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