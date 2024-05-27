'use client';
import UserCard from '@/components/UserCard';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedUser = localStorage.getItem('name');
            setUser(storedUser);
        }
    }, []);
    const handleLogout = () => {
        toast.success('Logged out successfully!');
        localStorage.clear();
        router.push('/login');
    };
    return (
        <main className="p-5">
            <nav className="flex justify-between">
                <div>
                    <Link className={buttonVariants({ variant: 'link' })} href="/">
                        Notefy
                    </Link>
                </div>
                <div>
                    <Link className={buttonVariants({ variant: 'link' })} href="/about">
                        About
                    </Link>
                </div>
            </nav>
            {user && (
                <div className="flex justify-between items-center bg-gray-100 px-2  rounded-md">
                    <div>
                        <h1 className="text-xl font-semibold p-5 text-orange-800">Hi! {user}</h1>
                    </div>
                    <div>
                        <Button className={buttonVariants({ variant: 'destructive' })} onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            )}
            {!user && (
                <Link className={buttonVariants({ variant: 'default' })} href="/login">
                    Login to continue
                </Link>
            )}
            {user && <UserCard />}
        </main>
    );
}
