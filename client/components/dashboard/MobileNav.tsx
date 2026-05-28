"use client"

import { LayoutDashboard, FileText, History, Smartphone, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MobileNav = () => {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute bottom-20 right-4">
        <button className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-brand border border-border">
          <Plus size={28} />
        </button>
      </div>

      <nav className="bg-[#1a1a1a] text-white rounded-t-3xl px-6 py-4 flex justify-between items-center pb-safe">
        <Link href="/dashboard" className="flex flex-col items-center space-y-1 opacity-50 hover:opacity-100">
          <LayoutDashboard size={20} />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link href="/dashboard/assignments" className="flex flex-col items-center space-y-1">
          <FileText size={20} />
          <span className="text-[10px] font-bold">Assignments</span>
        </Link>
        <Link href="/dashboard/library" className="flex flex-col items-center space-y-1 opacity-50 hover:opacity-100">
          <History size={20} />
          <span className="text-[10px]">Library</span>
        </Link>
        <Link href="/dashboard/toolkit" className="flex flex-col items-center space-y-1 opacity-50 hover:opacity-100">
          <Smartphone size={20} />
          <span className="text-[10px]">AI Toolkit</span>
        </Link>
      </nav>
    </div>
  )
}

export default MobileNav