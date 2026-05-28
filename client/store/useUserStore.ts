import { create } from 'zustand'

export interface UserProfile {
	id: string
	name: string
	email: string
	role: 'teacher' | 'student' | 'admin'
	schoolName: string
	avatarUrl: string
}

interface UserState {
	user: UserProfile | null
	isLoggedIn: boolean
	setUser: (user: UserProfile) => void
	updateUser: (updates: Partial<UserProfile>) => void
	clearUser: () => void
}

const dummyUser: UserProfile = {
	id: 'user-001',
	name: 'John Doe',
	email: 'john.doe@vedaai.com',
	role: 'teacher',
	schoolName: 'Delhi Public School, Bokaro',
	avatarUrl: 'https://robohash.org/john doe',
}

export const useUserStore = create<UserState>((set) => ({
	user: dummyUser,
	isLoggedIn: true,
	setUser: (user) => set({ user, isLoggedIn: true }),
	updateUser: (updates) =>
		set((state) => ({
			user: state.user ? { ...state.user, ...updates } : dummyUser,
			isLoggedIn: true,
		})),
	clearUser: () => set({ user: null, isLoggedIn: false }),
}))
