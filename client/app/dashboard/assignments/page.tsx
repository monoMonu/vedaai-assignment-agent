"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, MoreVertical, FileX2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { IAssignment } from '@/types'
import Image from 'next/image'

export default function AssignmentsPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<IAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true)
        setError('')

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
        const response = await fetch(`${baseUrl}/api/assignments`)

        if (!response.ok) {
          throw new Error('Failed to fetch assignments')
        }

        const data = await response.json()
        setAssignments(data)
      } catch (fetchError) {
        console.error(fetchError)
        setError('Unable to load assignments right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const handleViewAssignment = (assignment: IAssignment) => {
    if (assignment.paperId) {
      router.push(`/dashboard/paper/${assignment.paperId}`)
      return
    }

    router.push('/dashboard/assignments/create')
  }

  const handleDeleteAssignment = async (id: IAssignment['_id']) => {
    try {
      setError('')

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
      const response = await fetch(`${baseUrl}/api/assignments/delete/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete assignment')
      }

      setAssignments(prev => prev.filter(el => el._id != id));
    } catch (fetchError) {
      console.error(fetchError)
      setError('Unable to delete assignments right now.')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center px-4 mt-12 md:mt-0">
        <div className="w-14 h-14 rounded-full border-4 border-muted-foreground/20 border-t-foreground animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-3">Loading assignments</h2>
        <p className="text-muted-foreground">Fetching assignments from the database.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center px-4 mt-12 md:mt-0">
        <h2 className="text-2xl font-bold text-foreground mb-3">Could not load assignments</h2>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Button onClick={() => window.location.reload()} className="rounded-full px-8 py-6 font-medium shadow-md w-full md:w-auto">
          Retry
        </Button>
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center px-4 mt-12 md:mt-0">
        <Image 
          src={'/no-assignments.png'}
          className='w-56 h-56'
          width={300}
          height={300}
          alt='No Assignment found'
        />
        <h2 className="text-2xl font-bold text-foreground mb-3">No assignments yet</h2>
        <p className="text-muted-foreground mb-8">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <Button className="rounded-full px-8 py-6 font-medium shadow-md w-full md:w-auto" onClick={() => router.push('/dashboard/assignments/create')}>
          <Plus className="mr-2 h-5 w-5" /> Create Your First Assignment
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto relative min-h-screen">
      <div className="mb-4 flex items-center space-x-3">
        <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground text-sm">Manage and create assignment for your classes</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4 bg-sidebar p-2 rounded-lg">
        <Button variant="outline" className="justify-start bg-transparent text-muted-foreground w-full md:w-32 rounded-xl py-3 h-full">
          <Search className="mr-2 h-4 w-4" /> Filter By
        </Button>
        <div className="relative w-full md:max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Assignment" 
            className="pl-9 bg-transparent border-border rounded-xl w-full h-12 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {assignments.map((assignment) => (
          <Card key={assignment._id} className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition">
            <CardContent className="px-6">
              <div className="flex justify-between items-start mb-12">
                <h3 className="font-bold text-lg text-foreground">{assignment.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical size={20} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-40">
                    <DropdownMenuItem
                      className="whitespace-nowrap cursor-pointer font-medium text-sm rounded-lg py-2"
                      onSelect={() => handleViewAssignment(assignment)}
                    >
                      View Assignment
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer font-medium text-sm text-destructive focus:text-destructive rounded-lg py-2"
                      onClick={() => handleDeleteAssignment(assignment._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-between items-center text-xs md:text-sm font-medium gap-4">
                <span className="text-foreground"><span className="text-muted-foreground font-normal">Assigned on :</span> {new Date(assignment.createdAt).toLocaleDateString()}</span>
                <span className="text-foreground"><span className="text-muted-foreground font-normal">Due :</span> {new Date(assignment.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Status: {assignment.status}</span>
                <span>{assignment.paperId ? 'Paper ready' : 'Paper pending'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden md:flex fixed bottom-0 left-75 right-0 h-16 items-end justify-center pb-8 z-40 bg-linear-to-t from-background via-background/80 to-transparent backdrop-blur-[2px]">
        <Button 
          onClick={() => router.push('/dashboard/assignments/create')}
          className="rounded-full px-8 py-6 font-medium shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-[#1a1a1a] hover:bg-black text-white hover:scale-105 transition-all duration-200"
        >
          <Plus className="mr-2 h-5 w-5" /> Create Assignment
        </Button>
      </div>
    </div>
  )
}