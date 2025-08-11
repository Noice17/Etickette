"use client";

import { Search } from 'lucide-react';
import { UserIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import UserModal from './UserModal';
import { getUserById } from '@/utils/api';
import { UserDTO } from '../Models/UserDTO';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Header() {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState<number>(0);
    const [user, setUser] = useState<UserDTO | null>(null);
    
    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            setUserId(Number(storedId));
        }
    }, []);

    const handleOpenModal = async () => {
        if (userId) {
            try {
                const data = await getUserById(userId);
                setUser(data);
                setShowModal(true);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        }
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.clear(); // clears all localStorage data
        setShowModal(false);
        router.push("/login"); // redirect to homepage or login
        toast.success("Logout Successful!");
    };


    return (
        <div className="h-full w-full flex flex-row">
            <div className="h-full w-3/4 flex flex-row justify-center items-center">
                <img
                    src="/etickette-brand.svg"
                    alt="Logo"
                    className="h-10 w-auto object-contain ml-[6.5%]"
                />
                <div className="flex-1 flex items-end justify-center pb-5">
                    <form className="flex w-full justify-center">
                        <div className="relative w-3/4">
                            <input
                                type="text"
                                name="email"
                                className="w-full pl-3 pr-10 py-2 border border-gray-400 rounded"
                                placeholder="Search..."
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </form>
                </div>
            </div>
            <div className='w-1/4 h-full flex'>
                <div className='w-1/3 h-full mx-auto flex'>
                    <UserIcon
                        onClick={handleOpenModal}
                        className="w-2/3 h-2/3 mx-auto my-auto text-white
                        bg-icons rounded-full p-2 cursor-pointer hover:bg-icons/80"
                    />
                </div>
            </div>

            {showModal && user && (
                <UserModal
                    userId={userId}
                    onClose={() => setShowModal(false)}
                    onLogout={handleLogout}
                    user={user} // pass preloaded user
                />
            )}
        </div>
    );
}
