import { X } from 'lucide-react';
import { UserDTO } from "../Models/UserDTO";
import { UserIcon } from '@heroicons/react/24/solid';

type UserModalProps = {
    userId: number;
    onClose: () => void;
    onLogout: () => void;
    user: UserDTO;
};

export default function UserModal({ user, onClose, onLogout }: UserModalProps) {
    return (
        <div className="text-gray-500 fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden font-montserrat animate-fadeIn">
                
                <div className="flex justify-end items-center px-5 py-3">
                    <button onClick={onClose} className="text-dark-text hover:opacity-70 transition">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center p-6">
                    <div className="w-20 h-20 rounded-full bg-bg-og-bg-of-mc flex items-center justify-center shadow-md mb-4">
                        <UserIcon className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-xl font-semibold">{user.username}</p>
                    <p className="text-gray-category text-sm">{user.email}</p>
                </div>

                <div className="px-6 pb-6 space-y-2">
                    <div className="bg-lightBabyBlue px-4 py-2 rounded-lg">
                        <p className="text-sm"><strong>Username:</strong> {user.username}</p>
                    </div>
                    <div className="bg-lightBabyBlue px-4 py-2 rounded-lg">
                        <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 pb-6">
                    <button
                        onClick={onLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
