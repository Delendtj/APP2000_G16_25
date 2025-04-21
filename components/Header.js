'use client';
import Link from 'next/link';
import { useAuth } from '../module/context';


export default function Header() {
    const { user, isAdmin, logout } = useAuth(); // Add `logout` from the AuthProvider

    return (
        <header>            
            <h1>Discgolf</h1>
            <nav>
                <ul>
                    <li><Link href="/">Sporten</Link></li>
                    <li><Link href="/spill">Spill</Link></li>
                    <li><Link href="/klubber">Klubber</Link></li>
                    <li><Link href="/banesok">Banesøk</Link></li>
                    {user && <li><Link href="/userclub">Min klubb</Link></li>}
                    {!user && <li><Link href="/registrer">Registrer deg</Link></li>}
                    {!user && <li><Link href="/logginn">Logg Inn</Link></li>}
                    {user && (
                        <>
                            <li><Link href="/profil">Profil</Link></li>
                            {isAdmin() && <li><Link href="/admin">Admin Panel</Link></li>}
                            <li>
                                <button onClick={logout} style={{ background: 'brown', color: 'white', cursor: 'pointer' }}>
                                   LOGG UT  
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}