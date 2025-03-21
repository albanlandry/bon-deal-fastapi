'use client'

import { ReactNode, FC } from "react";
import { useEffect, useState } from "react";
import { Menu, LayoutDashboard, User, Settings, LogIn } from "lucide-react";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Stack } from "@chakra-ui/react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useAuth } from "@/lib/hooks/useAuth";

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: FC<SidebarProps> = ({ isOpen }) => {
    return (
        <div
            className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 p-5 transition-all ${isOpen ? "translate-x-0" : "-translate-x-64"
                } md:translate-x-0`}
        >
            <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
            <nav>
                <ul className="space-y-4">
                    <li>
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <LayoutDashboard size={20} /> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/posts" className="flex items-center gap-2">
                            <Settings size={20} /> Posts
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/users" className="flex items-center gap-2">
                            <User size={20} /> Users
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/settings" className="flex items-center gap-2">
                            <Settings size={20} /> Settings
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
      async function fetchUser() {
        const res = await fetchWithAuth("http://localhost:8000/users/me");
        const data = await res.json();
        setUser(data);
      }
      fetchUser();
    }, []);

    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <Button variant="ghost" onClick={toggleSidebar} className="md:hidden">
                <Menu size={24} />
            </Button>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <div>User Profile: {JSON.stringify(user)}</div>
        </header>
    );
};

export interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 min-h-screen ml-0 md:ml-64">
                <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;