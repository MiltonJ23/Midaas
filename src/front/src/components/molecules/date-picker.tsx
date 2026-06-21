"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { Calendar } from "@/components/molecules/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/molecules/popover";

type Props = {
    label: string;
    onChange?: (date: Date | undefined) => void;
    value?: Date;
    disabled?: boolean;
};

const MONTHS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export function DatePicker({ label, onChange, value, disabled }: Props) {
    const [date, setDate] = React.useState<Date | undefined>(value);
    const [currentMonth, setCurrentMonth] = React.useState<Date>(value || new Date());
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        setDate(value);
        if (value) {
            setCurrentMonth(value);
        }
    }, [value]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = parseInt(e.target.value);
        const newDate = new Date(currentMonth);
        newDate.setMonth(newMonth);
        setCurrentMonth(newDate);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(e.target.value);
        const newDate = new Date(currentMonth);
        newDate.setFullYear(newYear);
        setCurrentMonth(newDate);
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentMonth(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentMonth(newDate);
    };

    // Generate year options (from 1900 to 2100)
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear - 10; year <= currentYear + 100; year++) {
            years.push(year);
        }
        return years;
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
                {label}
            </label>
            
            <style dangerouslySetInnerHTML={{
                __html: `
                    .calendar-modern {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    }
                    
                    .calendar-modern .rdp-month_caption {
                        display: none !important;
                    }
                    
                    .calendar-modern nav {
                        display: none !important;
                    }
                    
                    .calendar-modern .rdp-month_grid {
                        width: 100% !important;
                        table-layout: fixed !important;
                        border-collapse: separate !important;
                        border-spacing: 0 !important;
                        margin-top: 12px !important;
                    }
                    
                    .calendar-modern .rdp-weekdays {
                        display: table-row !important;
                    }
                    
                    .calendar-modern .rdp-weekday {
                        display: table-cell !important;
                        width: 14.28% !important;
                        text-align: center !important;
                        padding: 8px 4px 12px 4px !important;
                        font-size: 11px !important;
                        font-weight: 600 !important;
                        color: #64748b !important;
                        text-transform: uppercase !important;
                        letter-spacing: 0.5px !important;
                    }
                    
                    .calendar-modern .rdp-weeks {
                        display: table-row-group !important;
                    }
                    
                    .calendar-modern .rdp-week {
                        display: table-row !important;
                    }
                    
                    .calendar-modern .rdp-week td {
                        display: table-cell !important;
                        width: 14.28% !important;
                        text-align: center !important;
                        padding: 2px !important;
                        vertical-align: middle !important;
                        height: 42px !important;
                    }
                    
                    .calendar-modern .rdp-day_button {
                        width: 38px !important;
                        height: 38px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        margin: 0 auto !important;
                        border-radius: 8px !important;
                        border: none !important;
                        background: transparent !important;
                        cursor: pointer !important;
                        font-size: 14px !important;
                        font-weight: 500 !important;
                        color: #1e293b !important;
                        transition: all 0.15s ease !important;
                    }
                    
                    .calendar-modern .rdp-day_button:hover {
                        background-color: #f1f5f9 !important;
                        color: #0f172a !important;
                        transform: scale(1.05) !important;
                    }
                    
                    .calendar-modern .rdp-selected .rdp-day_button {
                        background-color: #0f172a !important;
                        color: white !important;
                        font-weight: 600 !important;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                    }
                    
                    .calendar-modern .rdp-selected .rdp-day_button:hover {
                        background-color: #1e293b !important;
                    }
                    
                    .calendar-modern .rdp-today .rdp-day_button {
                        background-color: #e0f2fe !important;
                        color: #0369a1 !important;
                        font-weight: 600 !important;
                    }
                    
                    .calendar-modern .rdp-today.rdp-selected .rdp-day_button {
                        background-color: #0f172a !important;
                        color: white !important;
                    }
                    
                    .calendar-modern .rdp-outside .rdp-day_button {
                        opacity: 0.3 !important;
                        color: #94a3b8 !important;
                    }
                    
                    .calendar-modern .rdp-disabled .rdp-day_button {
                        opacity: 0.3 !important;
                        cursor: not-allowed !important;
                    }
                    
                    .calendar-modern .rdp-disabled .rdp-day_button:hover {
                        background-color: transparent !important;
                        transform: none !important;
                    }

                    .month-year-select {
                        appearance: none;
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 6px;
                        padding: 6px 32px 6px 12px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #1e293b;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                        background-repeat: no-repeat;
                        background-position: right 10px center;
                    }
                    
                    .month-year-select:hover {
                        background-color: #f1f5f9;
                        border-color: #cbd5e1;
                    }
                    
                    .month-year-select:focus {
                        outline: none;
                        border-color: #0f172a;
                        box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
                    }

                    .nav-button {
                        width: 32px;
                        height: 32px;
                        border-radius: 6px;
                        border: 1px solid #e2e8f0;
                        background: #f8fafc;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.15s ease;
                    }
                    
                    .nav-button:hover {
                        background-color: #f1f5f9;
                        border-color: #cbd5e1;
                    }
                    
                    .nav-button:active {
                        transform: scale(0.95);
                    }
                `
            }} />
            
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        disabled={disabled}
                        className={cn(
                            "w-full h-12 justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {date ? format(date, "PPP") : <span>Sélectionner une date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    className='w-auto p-0 z-[9999] bg-white border border-slate-200 rounded-lg shadow-lg' 
                    align='start'
                    side='bottom'
                    sideOffset={4}
                    avoidCollisions={true}
                    collisionPadding={10}
                >
                    <div 
                        className="calendar-modern" 
                        style={{
                            width: '340px',
                            padding: '20px',
                        }}
                    >
                        {/* Custom Header with Month/Year Dropdowns */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px',
                            gap: '8px'
                        }}>
                            <button
                                type="button"
                                className="nav-button"
                                onClick={handlePrevMonth}
                                aria-label="Mois précédent"
                            >
                                <ChevronLeft size={16} color="#64748b" />
                            </button>
                            
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                flex: 1
                            }}>
                                <select
                                    className="month-year-select"
                                    value={currentMonth.getMonth()}
                                    onChange={handleMonthChange}
                                    style={{ flex: 1 }}
                                >
                                    {MONTHS.map((month, index) => (
                                        <option key={index} value={index}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                                
                                <select
                                    className="month-year-select"
                                    value={currentMonth.getFullYear()}
                                    onChange={handleYearChange}
                                    style={{ width: '90px' }}
                                >
                                    {generateYearOptions().map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <button
                                type="button"
                                className="nav-button"
                                onClick={handleNextMonth}
                                aria-label="Mois suivant"
                            >
                                <ChevronRight size={16} color="#64748b" />
                            </button>
                        </div>

                        {/* Quick Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginBottom: '16px'
                        }}>
                            <button
                                type="button"
                                onClick={() => {
                                    const today = new Date();
                                    setDate(today);
                                    setCurrentMonth(today);
                                    onChange?.(today);
                                    setIsOpen(false);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#475569',
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                            >
                                Aujourd'hui
                            </button>
                            {date && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDate(undefined);
                                        onChange?.(undefined);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#dc2626',
                                        backgroundColor: '#fef2f2',
                                        border: '1px solid #fecaca',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#fee2e2';
                                        e.currentTarget.style.borderColor = '#fca5a5';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#fef2f2';
                                        e.currentTarget.style.borderColor = '#fecaca';
                                    }}
                                >
                                    Effacer
                                </button>
                            )}
                        </div>

                        <Calendar
                            mode='single'
                            selected={date}
                            onSelect={(selectedDate) => {
                                setDate(selectedDate);
                                onChange?.(selectedDate);
                                setIsOpen(false);
                            }}
                            disabled={disabled}
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}