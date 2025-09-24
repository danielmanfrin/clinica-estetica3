
import React, { useState, createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import { User, Role, Page, Service, Booking } from './types';
import { MOCK_USERS, MOCK_BOOKINGS, MOCK_SERVICES } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import LoginPage from './pages/LoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BookingModal from './components/BookingModal';
import PurchaseConfirmationModal from './components/PurchaseConfirmationModal';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  logout: () => void;
  services: Service[];
  addOrUpdateService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// FIX: Moved WhatsAppIcon component from constants.ts to App.tsx to fix JSX parsing errors in a .ts file.
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-white"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function App() {
  const adminUser = MOCK_USERS.find(u => u.role === Role.ADMIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  
  // App-wide state
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  
  // Modal states
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [purchaseConfirmation, setPurchaseConfirmation] = useState<{ service: Service, quantity: number } | null>(null);
  const [creditBookingService, setCreditBookingService] = useState<Service | null>(null);
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);

  const [showWhatsApp, setShowWhatsApp] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowWhatsApp(true);
      } else {
        setShowWhatsApp(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleLogin = useCallback((email: string) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      if (user.role === Role.ADMIN) {
        setCurrentPage(Page.ADMIN_DASHBOARD);
      } else {
        setCurrentPage(Page.USER_DASHBOARD);
      }
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentPage(Page.HOME);
  }, []);

  const handlePurchaseOrBook = useCallback((service: Service, quantity: number) => {
    if (!currentUser) {
        setCurrentPage(Page.LOGIN);
        return;
    }
    // It's a package purchase if the service itself is a package OR user selects more than one.
    if ((service.sessions && service.sessions > 1) || quantity > 1) {
      setPurchaseConfirmation({ service, quantity });
    } else {
      setBookingService(service);
    }
  }, [currentUser]);

  const handleConfirmPurchase = useCallback(() => {
    if (!purchaseConfirmation || !currentUser) return;

    const { service, quantity } = purchaseConfirmation;
    const sessionsPerPackage = service.sessions || 1;
    const totalCreditsToAdd = sessionsPerPackage * quantity;

    const existingCredits = currentUser.credits?.[service.id] || 0;
    const newCredits = {
      ...currentUser.credits,
      [service.id]: existingCredits + totalCreditsToAdd,
    };
    
    const updatedUser = { ...currentUser, credits: newCredits };
    setCurrentUser(updatedUser);
    
    // In a real app, this would also update the source of truth (e.g., MOCK_USERS array)
    // For this prototype, updating the state is sufficient for the UI to react.

    setPurchaseConfirmation(null);
    alert(`Compra de ${quantity} pacote(s) de ${service.name} confirmada! ${totalCreditsToAdd} créditos foram adicionados à sua conta.`);
  }, [purchaseConfirmation, currentUser]);

  const handleStartCreditBooking = useCallback((service: Service) => {
    if(currentUser) {
        setCreditBookingService(service);
    }
  }, [currentUser]);

  const handleStartReschedule = useCallback((booking: Booking) => {
    setReschedulingBooking(booking);
  }, []);

  const handleConfirmFinalBooking = useCallback((details: { date: Date, professionalId: string }) => {
    if (!currentUser) return;

    if (reschedulingBooking) {
      // Reschedule logic
      const updatedBooking = { ...reschedulingBooking, ...details, status: 'confirmed' as const };
      setBookings(prev => prev.map(b => (b.id === reschedulingBooking.id ? updatedBooking : b)));
    } else {
      // New booking logic
      const serviceToBook = bookingService || creditBookingService;
      if (!serviceToBook) return;

      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        userId: currentUser.id,
        serviceId: serviceToBook.id,
        professionalId: details.professionalId,
        date: details.date,
        status: 'confirmed',
      };
      setBookings(prev => [...prev, newBooking]);

      // If it was a credit booking, deduct the credit
      if (creditBookingService) {
        const existingCredits = currentUser.credits?.[creditBookingService.id] || 0;
        const newCredits = {
          ...currentUser.credits,
          [creditBookingService.id]: Math.max(0, existingCredits - 1),
        };
        setCurrentUser({ ...currentUser, credits: newCredits });
      }
    }
  }, [currentUser, bookingService, creditBookingService, reschedulingBooking]);

  const handleCloseModals = () => {
    setBookingService(null);
    setPurchaseConfirmation(null);
    setCreditBookingService(null);
    setReschedulingBooking(null);
  };

  const addOrUpdateService = useCallback((service: Service) => {
    setServices(prevServices => {
        const isExisting = prevServices.some(s => s.id === service.id);
        if (isExisting) {
            return prevServices.map(s => s.id === service.id ? service : s);
        }
        return [...prevServices, service];
    });
  }, []);

  const deleteService = useCallback((serviceId: string) => {
    setServices(prevServices => prevServices.filter(s => s.id !== serviceId));
  }, []);

  const appContextValue = useMemo(() => ({
    currentUser,
    setCurrentUser,
    currentPage,
    setCurrentPage,
    logout,
    services,
    addOrUpdateService,
    deleteService,
  }), [currentUser, currentPage, logout, services, addOrUpdateService, deleteService]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <HomePage onPurchaseOrBook={handlePurchaseOrBook} />;
      case Page.SERVICES:
        return <ServicesPage onPurchaseOrBook={handlePurchaseOrBook} />;
      case Page.LOGIN:
        return <LoginPage onLogin={handleLogin} />;
      case Page.USER_DASHBOARD:
        return <UserDashboardPage onBookWithCredit={handleStartCreditBooking} onReschedule={handleStartReschedule} />;
      case Page.ADMIN_DASHBOARD:
        return <AdminDashboardPage />;
      default:
        return <HomePage onPurchaseOrBook={handlePurchaseOrBook} />;
    }
  };

  const serviceForBookingModal = bookingService || creditBookingService || (reschedulingBooking ? services.find(s => s.id === reschedulingBooking.serviceId) : null);

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {renderPage()}
        </main>
        <Footer />

        {serviceForBookingModal && (
          <BookingModal 
            service={serviceForBookingModal}
            booking={reschedulingBooking} 
            onClose={handleCloseModals}
            isCreditBooking={!!creditBookingService}
            onConfirmBooking={handleConfirmFinalBooking}
          />
        )}
        
        {purchaseConfirmation && (
          <PurchaseConfirmationModal 
            service={purchaseConfirmation.service}
            quantity={purchaseConfirmation.quantity}
            onConfirm={handleConfirmPurchase}
            onClose={handleCloseModals}
          />
        )}

        <a 
            href="https://wa.me/5511999999999" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`fixed bottom-6 right-6 bg-green-500 rounded-full p-3 shadow-lg hover:bg-green-600 transition-transform duration-300 transform ${showWhatsApp ? 'scale-100' : 'scale-0'}`}
            aria-label="Contact us on WhatsApp"
        >
            <WhatsAppIcon />
        </a>
      </div>
    </AppContext.Provider>
  );
}
