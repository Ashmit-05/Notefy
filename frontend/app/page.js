import { Button } from '@/components/ui/button';
import UserCard from '@/components/UserCard';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

import Image from 'next/image';

export default function Home() {
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
            <UserCard />
        </main>
    );
}
