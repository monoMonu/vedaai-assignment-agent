"use client"

import { useUserStore } from '@/store/useUserStore'
import { 
  FileText, 
  LayoutDashboard, 
  Plus, 
  Users, 
  Smartphone, 
  History, 
  Settings 
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Groups', href: '/dashboard/groups', icon: Users },
  { label: 'Assignments', href: '/dashboard/assignments', icon: FileText },
  { label: 'AI Teacher\'s Toolkit', href: '/dashboard/toolkit', icon: Smartphone },
  { label: 'My Library', href: '/dashboard/library', icon: History },
]

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUserStore();

  return (
    <aside className="w-72 bg-sidebar flex flex-col justify-between border-r border-sidebar-border shadow-sm z-10 m-3 rounded-lg">
      <div>
        <div className="p-6 flex items-center space-x-2">
          <Image 
            width={12}
            height={12}
            src={'/logo.svg'}
            alt='Profile pic'
            className='w-10 h-10'
          />
          <span className="text-[28px] font-bold text-sidebar-foreground">VedaAI</span>
        </div>
        
        <div className="px-4">
          <button className="w-full bg-primary text-primary-foreground flex items-center justify-center space-x-2 py-3 px-4 rounded-xl hover:opacity-90 transition mb-6 shadow-sm">
            <Plus size={18} />
            <Link href={'/dashboard/assignments/create'}>Create Assignment</Link>
          </button>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link 
                  key={item.label}
                  href={item.href} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition font-medium ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {/* {item.badge && (
                    <span className="ml-auto bg-brand text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )} */}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="px-4 pb-4">
        <Link 
          href="/settings" 
          className="flex items-center space-x-3 px-4 py-3 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground rounded-md transition font-medium mb-2"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>

        <div className="bg-muted p-3 rounded-xl flex items-center space-x-3 border border-border/50">
          <div className="w-10 h-10 bg-chart-1/20 rounded-full shrink-0 border border-chart-1/30">
            <Image
              width={56}
              height={56}
              src={user?.avatarUrl || 'https://api.dicebear.com/9.x/initials/svg?seed=John%20Doe'}
              alt='Profile pic'
              className='w-full h-full'
            />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Delhi Public School</p>
            <p className="text-xs text-muted-foreground">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar