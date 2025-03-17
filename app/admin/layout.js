'use client';
//CHATGPT
import { useAuth } from "../../module/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from '../../components/Header';

export default function AdminLayout({ children }) {
  const { user, isAdmin } = useAuth();
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
            <ul>
              <li><a href="/admin/dashboard">Dashboard</a></li>
              <li><a href="/admin/users">Manage Users</a></li>
              <li><a href="/admin/memberships">Manage Memberships</a></li>
              <li><a href="/admin/clubs">Manage Clubs</a></li>
            </ul>
          </nav>
        </div>
        <main className="admin-content">
          {children}
        </main>
      </div>
      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 60px);
        }
        .admin-sidebar {
          width: 250px;
          background: #1a1a1a;
          padding: 20px;
          color: white;
        }
        .admin-sidebar h2 {
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #444;
        }
        .admin-sidebar ul {
          list-style: none;
          padding: 0;
        }
        .admin-sidebar li {
          margin: 10px 0;
        }
        .admin-sidebar a {
          color: #ddd;
          text-decoration: none;
          display: block;
          padding: 8px 10px;
          border-radius: 5px;
          transition: background 0.3s;
        }
        .admin-sidebar a:hover {
          background: #333;
          color: white;
        }
        .admin-content {
          flex: 1;
          padding: 20px;
          background: #2c2c2c;
        }
      `}</style>
    </>
  );
}