import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import * as authService from '../services/authService'
import type { Session } from '../types'

interface AuthState {
  session: Session | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  /** Clears the session if its token has expired. Returns true when a valid session remains. */
  checkExpiry: () => boolean
}

/*
 * Token storage choice: sessionStorage. The token disappears when the tab closes and is
 * not shared across tabs, but any script running on the page (XSS) can still read it.
 * httpOnly cookies set by a real server are safer; they are not possible with a static site.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      login: async (email, password) => {
        const session = await authService.login(email, password)
        set({ session })
      },
      logout: () => set({ session: null }),
      checkExpiry: () => {
        const { session } = get()
        if (session && session.expiresAt <= Date.now()) {
          set({ session: null })
          return false
        }
        return session !== null
      },
    }),
    { name: 'fitbook-auth', storage: createJSONStorage(() => sessionStorage), partialize: (s) => ({ session: s.session }) },
  ),
)
