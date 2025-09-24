
import React, { useState, useMemo, useCallback } from 'react';
import { MOCK_BOOKINGS } from '../../constants';
import { Booking, Service } from '../../types';
import AdminBookingModal from '../../components/AdminBookingModal';
import AgendaWeekView from '../../components/Agenda/WeekView';
import AgendaMonthView from '../../components/Agenda/MonthView';
import AgendaDayView from '../../components/Agenda/DayView';
import { useApp } from '../../App';

type AgendaView = 'day' | 'week' | 'month';

// Date utility functions
const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Saturday
    return { start, end };
};

export default function AdminAgenda() {
    const { services } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<AgendaView>('week'); // Default to week view
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [defaultDateForNewBooking, setDefaultDateForNewBooking] = useState<Date | undefined>(undefined);

    // This is mock state management. In a real app, you'd fetch and update via API.
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

    const openCreateModal = useCallback((date?: Date) => {
        setSelectedBooking(null);
        setDefaultDateForNewBooking(date);
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((booking: Booking) => {
        setSelectedBooking(booking);
        setDefaultDateForNewBooking(undefined);
        setIsModalOpen(true);
    }, []);

    const handleSaveBooking = (booking: Booking) => {
        const existingIndex = bookings.findIndex(b => b.id === booking.id);
        if (existingIndex > -1) {
            setBookings(prev => prev.map(b => b.id === booking.id ? booking : b));
        } else {
            setBookings(prev => [...prev, booking]);
        }
        setIsModalOpen(false);
    };

    const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
        if (direction === 'today') {
            setCurrentDate(new Date());
            return;
        }

        const newDate = new Date(currentDate);
        const increment = direction === 'prev' ? -1 : 1;

        if (view === 'month') {
            newDate.setMonth(newDate.getMonth() + increment);
        } else if (view === 'week') {
            newDate.setDate(newDate.getDate() + (7 * increment));
        } else { // day
            newDate.setDate(newDate.getDate() + increment);
        }
        setCurrentDate(newDate);
    };

    const headerTitle = useMemo(() => {
        if (view === 'month') {
            return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        }
        if (view === 'week') {
            const { start, end } = getWeekRange(currentDate);
            const startMonth = start.toLocaleDateString('pt-BR', { month: 'short' });
            const endMonth = end.toLocaleDateString('pt-BR', { month: 'short' });
            const startDay = start.getDate();
            const endDay = end.getDate();
            const year = start.getFullYear();

            if (startMonth === endMonth) {
                return `${startDay} - ${endDay} de ${start.toLocaleDateString('pt-BR', { month: 'long' })}, ${year}`;
            }
            return `${startDay} de ${startMonth} - ${endDay} de ${endMonth}, ${year}`;
        }
        return currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }, [currentDate, view]);

    const renderView = () => {
        switch (view) {
            case 'day':
                return <AgendaDayView currentDate={currentDate} bookings={bookings} onBookingClick={openEditModal} onNewBooking={openCreateModal} services={services} />;
            case 'week':
                return <AgendaWeekView currentDate={currentDate} bookings={bookings} onBookingClick={openEditModal} onNewBooking={openCreateModal} services={services} />;
            case 'month':
                return <AgendaMonthView currentDate={currentDate} bookings={bookings} onBookingClick={openEditModal} onNewBooking={openCreateModal} services={services} />;
            default:
                return null;
        }
    };
    
    const ViewButton: React.FC<{ viewName: AgendaView, label: string }> = ({ viewName, label }) => (
        <button 
            onClick={() => setView(viewName)}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === viewName ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >{label}</button>
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <button onClick={() => handleNavigate('prev')} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <span className="font-semibold text-lg md:text-xl w-64 text-center capitalize">
                        {headerTitle}
                    </span>
                    <button onClick={() => handleNavigate('next')} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                    <button onClick={() => handleNavigate('today')} className="px-3 py-1.5 border rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors ml-2">Hoje</button>
                </div>
                 <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
                        <ViewButton viewName="day" label="Dia" />
                        <ViewButton viewName="week" label="Semana" />
                        <ViewButton viewName="month" label="Mês" />
                    </div>
                </div>
                <button onClick={() => openCreateModal()} className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-semibold shadow">
                    + Novo Agendamento
                </button>
            </div>
            
            {/* Calendar View */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {renderView()}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <AdminBookingModal 
                    booking={selectedBooking}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveBooking}
                    defaultDate={defaultDateForNewBooking}
                />
            )}
        </div>
    );
}
