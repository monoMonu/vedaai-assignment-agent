import Header from '@/components/dashboard/Header';
import AssignmentStatusWidget from '@/components/dashboard/AssignmentStatusWidget';
import MobileNav from '@/components/dashboard/MobileNav';
import Sidebar from '@/components/dashboard/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background text-foreground font-sans flex h-screen overflow-hidden">
      
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        <Header />

        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {children}
        </div>
        <MobileNav />
        <AssignmentStatusWidget />
      </main>
    </main>
  );
}