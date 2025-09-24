import React, { useState, useMemo } from 'react';
import { MOCK_USERS, MOCK_PROFESSIONALS } from '../../constants';
import { User, Role } from '../../types';
import UserModal from '../../components/UserModal';

export default function AdminManageUsers() {
    const initialUsers = useMemo(() => {
        const professionalsAsUsers: User[] = MOCK_PROFESSIONALS.map(p => ({
            id: p.id,
            name: p.name,
            email: `${p.name.toLowerCase().replace('dr. ', '').replace(' ', '.')}@bellezapura.com`,
            phone: '(11) 90000-0000',
            cpf: '000.000.000-00',
            role: Role.STAFF
        }));
        return [...MOCK_USERS, ...professionalsAsUsers];
    }, []);

    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);

    const handleAddNewUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };
    
    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (savedUser: User) => {
        const isExisting = users.some(u => u.id === savedUser.id);
        if (isExisting) {
            setUsers(users.map(u => u.id === savedUser.id ? savedUser : u));
        } else {
            setUsers([...users, savedUser]);
        }
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Gerenciar Usuários</h2>
                <button 
                    onClick={handleAddNewUser}
                    className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600"
                >
                    Adicionar Usuário
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                            <th className="px-5 py-3">Nome</th>
                            <th className="px-5 py-3">Email</th>
                            <th className="px-5 py-3">Função</th>
                            <th className="px-5 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <p className="font-semibold">{user.name}</p>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <p>{user.email}</p>
                                </td>
                                <td className="px-5 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                         user.role === Role.ADMIN ? 'bg-purple-200 text-purple-800' :
                                         user.role === Role.CLIENT ? 'bg-green-200 text-green-800' :
                                         'bg-blue-200 text-blue-800'
                                     }`}>
                                        {user.role.toLowerCase()}
                                     </span>
                                </td>
                                <td className="px-5 py-4 text-right whitespace-nowrap">
                                    <button onClick={() => handleEditUser(user)} className="text-sm text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                                    <button className="text-sm text-red-600 hover:text-red-800">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <UserModal 
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
}