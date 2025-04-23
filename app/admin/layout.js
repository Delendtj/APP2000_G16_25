'use client';
import { useAuth } from "../../module/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from '../../components/Header';
import Link from 'next/link';
import "./admin.css";

export default function AdminLayout({ children }) {
  const { user, isAdmin, adminClubId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is an admin
    if (!user) {
      router.push('/logginn');
    } else if (!isAdmin()) {
      router.push('/profil');
    }
  }, [user, router]);

  // If user is not admin, show nothing (we're redirecting)
  if (!user || !isAdmin()) {
    return <div>Checking authorization...</div>;
  }

  return (
    <>
      <Header />
      <div className="admin-layout">
        <div className="admin-sidebar">
          <h2>Admin Panel</h2>
          <nav>
              <ul><Link href="/admin">Dashboard</Link></ul>
              {adminClubId && (
                <>
                  <ul><Link href={`/admin/coursemanager?clubId=${adminClubId}`}>Manage Courses</Link></ul>
                  <ul><Link href={`/admin/medlemsliste?clubId=${adminClubId}`}>Manage Members</Link></ul>
                  <ul><Link href={`/admin/tournament?clubId=${adminClubId}`}>Manage Tournaments</Link></ul>
                  <ul><Link href={`/admin/editpage?clubId=${adminClubId}`}>Manage Club Page</Link></ul>
                </>
              )}
            
          </nav>
        </div>
        <main className="admin-content">
          {children}
        </main>
      </div>
    </>
  );
}