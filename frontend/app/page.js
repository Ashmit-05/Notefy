import UserCard from '@/components/UserCard';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
    const user=localStorage.getItem('email');
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
            {user && (<h1 className="text-xl font-semibold p-5 text-orange-400">Hi! {user}</h1>)}
            {!user && (<Link className={buttonVariants({ variant: 'ghost' })} href="/login">Login to continue</Link>)}
           {user && (<UserCard />)} 
        </main>
    );
}
