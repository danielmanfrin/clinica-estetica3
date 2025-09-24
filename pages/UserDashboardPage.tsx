
import React, { useState } from 'react';
import { useApp } from '../App';
import { MOCK_BOOKINGS, MOCK_PROFESSIONALS } from '../constants';
import StarRating from '../components/StarRating';
import { Booking, User, Service } from '../types';
import EditProfileModal from '../components/EditProfileModal';
import ConfirmationModal from '../components/ConfirmationModal';

interface BookingCardProps {
    booking: Booking;
    onCancel: (bookingId: string) => void;
    onReschedule: (booking: Booking) => void;
    services: Service[];
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, onReschedule, services }) => {
    const service = services.find(s => s.id === booking.serviceId);
    const professional = MOCK_PROFESSIONALS.find(p => p.id === booking.professionalId);
    
    const [newRating, setNewRating] = useState(booking.rating || 0);
    const [newComment, setNewComment] = useState(booking.comment || '');
    const [commentError, setCommentError] = useState('');

    if (!service || !professional) return null;

    const statusMap = {
        confirmed: { text: 'Confirmado', classes: 'bg-blue-100 text-blue-800' },
        completed: { text: 'Realizado', classes: 'bg-green-100 text-green-800' },
        canceled: { text: 'Cancelado', classes: 'bg-red-100 text-red-800' },
    };
    const statusInfo = statusMap[booking.status] || { text: booking.status, classes: 'bg-gray-100 text-gray-800' };

    const handleReviewSubmit = () => {
        if (newRating === 0) {
            setCommentError('Por favor, selecione uma avaliação de estrelas.');
            return;
        }
        if (newComment.trim().length < 10) {
            setCommentError('O comentário deve ter pelo menos 10 caracteres.');
            return;
        }
        setCommentError('');
        alert(`Avaliação enviada: ${newRating} estrelas, "${newComment}". Obrigado!`);
        // In a real app, this would submit to an API and update the booking state.
        // For now, we'll just show the alert.
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                    <p className="text-gray-500 text-sm">com {professional.name}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusInfo.classes}`}>
                    {statusInfo.text}
                </span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700"><strong>Data:</strong> {new Date(booking.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-700"><strong>Horário:</strong> {new Date(booking.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            {booking.status === 'completed' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    {booking.rating ? (
                        <div>
                            <p className="font-semibold mb-1">Sua Avaliação:</p>
                            <StarRating rating={booking.rating} readOnly={true} />
                            <p className="text-sm text-gray-600 italic mt-2">"{booking.comment}"</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-semibold mb-2">Avalie este serviço:</p>
                            <StarRating rating={newRating} onRatingChange={(r) => { setNewRating(r); setCommentError(''); }} />
                            <textarea 
                                value={newComment}
                                onChange={(e) => {
                                    setNewComment(e.target.value);
                                    if(commentError) setCommentError('');
                                }}
                                className={`w-full mt-2 p-2 border rounded-md bg-white text-gray-900 transition-colors ${commentError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'}`} 
                                placeholder="Deixe um comentário..."
                                rows={3}
                            ></textarea>
                            {commentError && <p className="text-red-500 text-xs mt-1">{commentError}</p>}
                            <button onClick={handleReviewSubmit} className="mt-2 px-4 py-1 bg-pink-500 text-white text-sm rounded-full hover:bg-pink-600">Enviar Avaliação</button>
                        </div>
                    )}
                </div>
            )}
            {booking.status === 'confirmed' && (
                 <div className="mt-4 pt-4 border-t flex gap-2">
                     <button onClick={() => onReschedule(booking)} className="text-sm px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Reagendar</button>
                     <button onClick={() => onCancel(booking.id)} className="text-sm px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200">Cancelar</button>
                 </div>
            )}
        </div>
    );
};

interface UserDashboardPageProps {
    onBookWithCredit: (service: Service) => void;
    onReschedule: (booking: Booking) => void;
}

export default function UserDashboardPage({ onBookWithCredit, onReschedule }: UserDashboardPageProps) {
    const { currentUser, setCurrentUser, services } = useApp();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
    const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

    const handleConfirmCancel = () => {
        if (!bookingToCancel) return;
        const updatedBookings = bookings.map(b => 
            b.id === bookingToCancel ? { ...b, status: 'canceled' as const } : b
        );
        setBookings(updatedBookings);
        setBookingToCancel(null);
    };

    if (!currentUser) {
        return <div className="p-8 text-center">Faça login para ver seu painel.</div>;
    }

    const handleProfileSave = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        setIsEditModalOpen(false);
        // In a real app, you'd show a success toast here.
        alert('Perfil atualizado com sucesso!');
    };

    const userBookings = bookings.filter(b => b.userId === currentUser.id);
    const upcomingBookings = userBookings
        .filter(b => b.status === 'confirmed')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pastBookings = userBookings
        .filter(b => b.status !== 'confirmed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const userCredits = currentUser.credits && Object.entries(currentUser.credits).filter(([, count]) => count > 0);

    return (
        <div className="bg-gray-100 min-h-[80vh] py-12">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8">Minha Conta</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                        {userCredits && userCredits.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-semibold mb-4">Meus Créditos</h2>
                                <div className="space-y-4">
                                    {userCredits.map(([serviceId, count]) => {
                                        const service = services.find(s => s.id === serviceId);
                                        if (!service) return null;
                                        return (
                                            <div key={serviceId} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                                                    <p className="text-green-600 font-semibold">{count} {count > 1 ? 'sessões restantes' : 'sessão restante'}</p>
                                                </div>
                                                <button onClick={() => onBookWithCredit(service)} className="px-5 py-2 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors">Agendar</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        <section className="bg-pink-50 p-6 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">Próximos Agendamentos</h2>
                            {upcomingBookings.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingBookings.map(b => <BookingCard key={b.id} booking={b} onCancel={setBookingToCancel} onReschedule={onReschedule} services={services} />)}
                                </div>
                            ) : (
                                <p className="bg-white p-6 rounded-lg shadow-sm text-gray-600">Você não possui agendamentos futuros.</p>
                            )}
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Histórico de Agendamentos</h2>
                             {pastBookings.length > 0 ? (
                                <div className="space-y-4">
                                    {pastBookings.map(b => <BookingCard key={b.id} booking={b} onCancel={setBookingToCancel} onReschedule={onReschedule} services={services} />)}
                                </div>
                            ) : (
                                <p className="bg-white p-6 rounded-lg shadow-sm text-gray-600">Você ainda não realizou nenhum procedimento.</p>
                            )}
                        </section>
                    </div>
                    
                    <aside>
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
                            <h3 className="text-xl font-bold mb-4">{currentUser.name}</h3>
                            <div className="space-y-2 text-gray-600">
                                <p><span className="font-semibold">Email:</span> {currentUser.email}</p>
                                <p><span className="font-semibold">Telefone:</span> {currentUser.phone}</p>
                                <p><span className="font-semibold">CPF:</span> {currentUser.cpf}</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(true)} className="mt-6 w-full py-2 bg-gray-800 text-white rounded-full hover:bg-pink-500 transition-colors">Editar Perfil</button>
                        </div>
                    </aside>
                </div>
            </div>
             {isEditModalOpen && (
                <EditProfileModal 
                    user={currentUser}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleProfileSave}
                />
            )}
            {bookingToCancel && (
                <ConfirmationModal
                    title="Confirmar Cancelamento"
                    message="Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
                    onConfirm={handleConfirmCancel}
                    onCancel={() => setBookingToCancel(null)}
                    confirmText="Sim, cancelar"
                    cancelText="Manter agendamento"
                    isDestructive={true}
                />
            )}
        </div>
    );
}