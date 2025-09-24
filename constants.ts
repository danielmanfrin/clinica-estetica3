import { User, Role, Service, Professional, Booking, Sale } from './types';

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Limpeza de Pele Profunda', description: 'Remoção de cravos e impurezas, com hidratação e máscara calmante.', duration: 60, price: 180.00, imageUrl: 'https://picsum.photos/seed/facial/400/300', category: 'Facial' },
  { id: '2', name: 'Aplicação de Botox', description: 'Toxina botulínica para suavizar rugas e linhas de expressão.', duration: 45, price: 1200.00, imageUrl: 'https://picsum.photos/seed/botox/400/300', category: 'Harmonização' },
  { id: '3', name: 'Massagem Relaxante', description: 'Técnicas de massoterapia para alívio de tensões e estresse.', duration: 50, price: 150.00, imageUrl: 'https://picsum.photos/seed/massage/400/300', category: 'Corporal' },
  { id: '4', name: 'Depilação a Laser (Axilas)', description: 'Remoção duradoura dos pelos com tecnologia de laser de diodo.', duration: 20, price: 99.00, imageUrl: 'https://picsum.photos/seed/laser/400/300', category: 'Depilação' },
  { id: '5', name: 'Preenchimento Labial', description: 'Aplicação de ácido hialurônico para volume e contorno dos lábios.', duration: 60, price: 950.00, imageUrl: 'https://picsum.photos/seed/lips/400/300', category: 'Harmonização' },
  { id: '6', name: 'Drenagem Linfática (Pacote)', description: 'Pacote com 10 sessões de massagem para reduzir retenção de líquidos e celulite.', duration: 50, price: 1400.00, imageUrl: 'https://picsum.photos/seed/drainage/400/300', category: 'Corporal', sessions: 10 },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  { id: 'prof1', name: 'Dr. Ana Costa', specialty: 'Dermatologia Estética', avatarUrl: 'https://picsum.photos/seed/ana/100/100' },
  { id: 'prof2', name: 'Juliana Lima', specialty: 'Esteticista Facial', avatarUrl: 'https://picsum.photos/seed/juliana/100/100' },
  { id: 'prof3', name: 'Mariana Alves', specialty: 'Massoterapeuta', avatarUrl: 'https://picsum.photos/seed/mariana/100/100' },
];

export const MOCK_USERS: User[] = [
  { id: 'user1', name: 'Carla Mendes', email: 'carla.mendes@example.com', phone: '(11) 98765-4321', cpf: '123.456.789-00', role: Role.CLIENT, credits: { '3': 5 } },
  { id: 'admin1', name: 'Sofia Gerente', email: 'admin@bellezapura.com', phone: '(11) 91234-5678', cpf: '987.654.321-99', role: Role.ADMIN },
  { id: 'user2', name: 'João Silva', email: 'joao.silva@example.com', phone: '(21) 99999-8888', cpf: '234.567.890-11', role: Role.CLIENT },
  { id: 'user3', name: 'Maria Oliveira', email: 'maria.oliveira@example.com', phone: '(31) 98888-7777', cpf: '345.678.901-22', role: Role.CLIENT },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);


export const MOCK_BOOKINGS: Booking[] = [
  // User 1 Bookings
  { id: 'booking1', userId: 'user1', serviceId: '1', professionalId: 'prof2', date: new Date(new Date().setDate(new Date().getDate() + 5)), status: 'confirmed' },
  { id: 'booking2', userId: 'user1', serviceId: '3', professionalId: 'prof3', date: new Date(new Date().setDate(new Date().getDate() - 10)), status: 'completed', rating: 5, comment: 'Adorei a massagem, muito relaxante!' },
  { id: 'booking3', userId: 'user1', serviceId: '4', professionalId: 'prof1', date: new Date(new Date().setDate(new Date().getDate() - 30)), status: 'completed', rating: 4, comment: 'Resultado ótimo.'},
  
  // Today's Bookings for Agenda
  { id: 'booking-today-1', userId: 'user2', serviceId: '1', professionalId: 'prof2', date: new Date(new Date().setHours(9, 0, 0, 0)), status: 'confirmed' },
  { id: 'booking-today-2', userId: 'user3', serviceId: '2', professionalId: 'prof1', date: new Date(new Date().setHours(11, 30, 0, 0)), status: 'confirmed' },
  
  // Tomorrow's Bookings
  { id: 'booking-tomorrow-1', userId: 'user1', serviceId: '5', professionalId: 'prof1', date: new Date(new Date(tomorrow).setHours(14, 0, 0, 0)), status: 'confirmed' },
  
  // Yesterday's Bookings
  { id: 'booking-yesterday-1', userId: 'user2', serviceId: '6', professionalId: 'prof3', date: new Date(new Date(yesterday).setHours(16, 0, 0, 0)), status: 'completed' },
  { id: 'booking-yesterday-2', userId: 'user3', serviceId: '4', professionalId: 'prof2', date: new Date(new Date(yesterday).setHours(10, 0, 0, 0)), status: 'canceled' },

  // Future Bookings
  { id: 'booking-future-1', userId: 'user2', serviceId: '3', professionalId: 'prof3', date: new Date(new Date().setDate(new Date().getDate() + 3)), status: 'confirmed' },
];


export const MOCK_SALES: Sale[] = [
    { id: 'sale9', serviceName: 'Aplicação de Botox', clientName: 'Fernanda Lima', amount: 1200.00, date: new Date(new Date().setMonth(new Date().getMonth() - 3)) },
    { id: 'sale1', serviceName: 'Limpeza de Pele Profunda', clientName: 'Carla Mendes', amount: 180.00, date: new Date(new Date().setDate(new Date().getDate() - 10)) },
    { id: 'sale2', serviceName: 'Massagem Relaxante', clientName: 'João Silva', amount: 150.00, date: new Date(new Date().setDate(new Date().getDate() - 8)) },
    { id: 'sale3', serviceName: 'Aplicação de Botox', clientName: 'Maria Oliveira', amount: 1200.00, date: new Date(new Date().setDate(new Date().getDate() - 5)) },
    { id: 'sale4', serviceName: 'Depilação a Laser (Axilas)', clientName: 'Carla Mendes', amount: 99.00, date: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: 'sale5', serviceName: 'Preenchimento Labial', clientName: 'Ana Paula', amount: 950.00, date: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: 'sale8', serviceName: 'Drenagem Linfática (Pacote)', clientName: 'Beatriz Costa', amount: 1400.00, date: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: 'sale6', serviceName: 'Limpeza de Pele Profunda', clientName: 'João Silva', amount: 180.00, date: new Date() },
    { id: 'sale7', serviceName: 'Massagem Relaxante', clientName: 'Maria Oliveira', amount: 150.00, date: new Date() },
];