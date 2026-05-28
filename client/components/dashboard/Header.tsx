'use client'

import { useUserStore } from '@/store/useUserStore'
import { ArrowLeft, Bell, FileText, LayoutDashboard, Sparkle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const Header = () => {

  const { user } = useUserStore();
  const pathname = usePathname();
  const [heading, setHeading] = useState({
    name: 'Home',
    to: '/dashboard',
    icon: FileText
  })

  useEffect(() => {
    if(pathname=='/dashboard') setHeading({
      name: 'Home',
      to: '/dashboard',
      icon: FileText
    });
    else if(pathname.includes('/dashboard/paper')) setHeading({
      name: 'Create New Assignment',
      to: '/dashboard/assignments/create',
      icon: Sparkle
    });
    else if(pathname=='/dashboard/assignments') 
      setHeading({
        name: 'Home',
        to: '/dashboard/assignments',
        icon: FileText
      });
  }, [pathname])

  return (
    <header className="h-14 flex items-center justify-between m-4 px-4 bg-sidebar rounded-lg">
      <div className="flex items-center space-x-4">
        {pathname != '/dashboard' && 
        <Link
          href={heading.to}
          className="p-2 hover:bg-muted rounded-full transition text-muted-foreground"
        >
          <ArrowLeft size={22} />
        </Link>}
        <h2 className="text-lg text-muted-foreground flex items-center space-x-2 font-medium">
          <heading.icon size={18} className="opacity-70" />
          <span>{heading.name}</span>
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 relative hover:bg-muted rounded-full transition">
          <Bell size={20} className="text-foreground/80" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-background"></span>
        </button>
        <div className="flex items-center space-x-2 bg-card px-3 py-1.5 rounded-full shadow-sm border border-border">
          <div className="w-6 h-6 bg-accent rounded-full">
            <Image 
              width={56}
              height={56}
              src={user?.avatarUrl || 'https://api.dicebear.com/9.x/initials/svg?seed=John%20Doe'}
              alt='Profile pic'
              className='w-full h-full'
            />
          </div>
          <span className="text-sm font-medium text-foreground">John Doe</span>
        </div>
      </div>
    </header>
  )
}

export default Header