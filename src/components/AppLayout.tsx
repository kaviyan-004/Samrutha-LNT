import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import DemoModeButton from './DemoModeButton';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const location = useLocation();

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavbar currentPath={location.pathname} />
                <main className="flex-1 overflow-y-auto grid-bg">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
            <DemoModeButton />
        </div>
    );
}

