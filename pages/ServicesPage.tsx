
import React, { useState, useMemo } from 'react';
import { Service } from '../types';
import ServiceCard from '../components/ServiceCard';
import { useApp } from '../App';

interface ServicesPageProps {
    onPurchaseOrBook: (service: Service, quantity: number) => void;
}

export default function ServicesPage({ onPurchaseOrBook }: ServicesPageProps) {
    const { services: MOCK_SERVICES } = useApp();
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = useMemo(() => 
        ['Todos', ...new Set(MOCK_SERVICES.map(s => s.category))], 
    [MOCK_SERVICES]);

    const filteredServices = useMemo(() => {
        let services = MOCK_SERVICES;

        // Filter by category
        if (selectedCategory !== 'Todos') {
            services = services.filter(s => s.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            services = services.filter(s => 
                s.name.toLowerCase().includes(lowercasedQuery) || 
                s.description.toLowerCase().includes(lowercasedQuery)
            );
        }
        
        return services;
    }, [selectedCategory, searchQuery, MOCK_SERVICES]);

    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Nossos Procedimentos</h1>
                <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">Explore nossa gama completa de tratamentos faciais, corporais e de harmonização, todos realizados com a máxima segurança e excelência.</p>
                
                <div className="mb-10 max-w-2xl mx-auto">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou descrição..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-shadow"
                        />
                    </div>
                </div>

                <div className="flex justify-center flex-wrap gap-3 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
                                selectedCategory === category 
                                ? 'bg-pink-500 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredServices.map(service => (
                            <ServiceCard key={service.id} service={service} onPurchaseOrBook={onPurchaseOrBook} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-semibold text-gray-700">Nenhum serviço encontrado</h3>
                        <p className="text-gray-500 mt-2">Tente ajustar sua busca ou remover os filtros.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
