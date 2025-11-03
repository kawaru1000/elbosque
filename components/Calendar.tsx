
import React, { useState } from 'react';

interface CalendarProps {
    onSelectTime: (time: Date) => void;
    serviceDuration: number;
}

const Calendar: React.FC<CalendarProps> = ({ onSelectTime, serviceDuration }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const startOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    };

    const addDays = (date: Date, days: number) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    
    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0,0,0,0);
        return date < today;
    }

    const generateTimeSlots = (date: Date, duration: number) => {
        const slots: Date[] = [];
        const now = new Date();

        // Working hours: 9:00 - 13:00 and 15:00 - 18:00
        const startMorning = new Date(date);
        startMorning.setHours(9, 0, 0, 0);

        const endMorning = new Date(date);
        endMorning.setHours(13, 0, 0, 0);

        const startAfternoon = new Date(date);
        startAfternoon.setHours(15, 0, 0, 0);

        const endAfternoon = new Date(date);
        endAfternoon.setHours(18, 0, 0, 0);

        let currentSlot = startMorning;
        while (addMinutes(currentSlot, duration) <= endMorning) {
            if (currentSlot > now) slots.push(new Date(currentSlot));
            currentSlot = addMinutes(currentSlot, 30); // Check every 30 mins
        }

        currentSlot = startAfternoon;
        while (addMinutes(currentSlot, duration) <= endAfternoon) {
            if (currentSlot > now) slots.push(new Date(currentSlot));
            currentSlot = addMinutes(currentSlot, 30);
        }

        return slots;
    };

    const addMinutes = (date: Date, minutes: number) => {
        return new Date(date.getTime() + minutes * 60000);
    };

    const timeSlots = selectedDate ? generateTimeSlots(selectedDate, serviceDuration) : [];

    const handleDateClick = (day: Date) => {
        if (isPast(day) || day.getDay() === 0 || day.getDay() === 6) return;
        setSelectedDate(day);
    };

    const renderHeader = () => {
        const dateFormat = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
        return (
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-2 rounded-full hover:bg-gray-600 transition-colors">
                    &lt;
                </button>
                <span className="text-xl font-semibold capitalize">{dateFormat.format(currentDate)}</span>
                <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-2 rounded-full hover:bg-gray-600 transition-colors">
                    &gt;
                </button>
            </div>
        );
    };
    
    const renderDays = () => {
        const days = [];
        const date = startOfWeek(currentDate);
        const dayFormat = new Intl.DateTimeFormat('es-ES', { weekday: 'short' });

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="text-center font-medium text-gray-400" key={i}>
                    {dayFormat.format(addDays(date, i)).slice(0, 3)}
                </div>
            );
        }
        return <div className="grid grid-cols-7 gap-2">{days}</div>;
    };
    
    const renderCells = () => {
        const startDate = startOfWeek(currentDate);
        const rows = [];
        
        let days = [];
        for (let i = 0; i < 7; i++) {
            const day = addDays(startDate, i);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isDisabled = isPast(day) || isWeekend;

            days.push(
                <div
                    key={day.toString()}
                    className={`p-3 text-center rounded-full transition-colors cursor-pointer ${
                        isDisabled ? 'text-gray-600 cursor-not-allowed' :
                        isSelected ? 'bg-cyan-500 text-white font-bold' :
                        'hover:bg-gray-600'
                    }`}
                    onClick={() => handleDateClick(day)}
                >
                    {day.getDate()}
                </div>
            );
        }
        rows.push(<div className="grid grid-cols-7 gap-2" key={currentDate.toString()}>{days}</div>);

        return <div className="mt-2">{rows}</div>;
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold text-center mb-6 text-cyan-400">Seleccione Fecha</h2>
                <div className="bg-gray-700 p-4 rounded-lg">
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </div>
            </div>
            <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold text-center mb-6 text-cyan-400">Seleccione Hora</h2>
                {selectedDate ? (
                     timeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-80 overflow-y-auto pr-2">
                        {timeSlots.map((slot, i) => (
                            <button
                                key={i}
                                onClick={() => onSelectTime(slot)}
                                className="bg-gray-700 p-3 rounded-lg text-center hover:bg-cyan-500 hover:text-white transition-colors"
                            >
                                {new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(slot)}
                            </button>
                        ))}
                    </div>
                     ) : (
                         <div className="text-center text-gray-400 p-4 bg-gray-700 rounded-lg">No hay horas disponibles para este día.</div>
                     )
                ) : (
                    <div className="text-center text-gray-400 p-4 bg-gray-700 rounded-lg">Por favor, seleccione un día para ver las horas disponibles.</div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
