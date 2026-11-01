import { useAuthStore } from '../store/authStore'

/** Read-only view of authentication for components. */
export function useAuth() {
  const session = useAuthStore((s) => s.session)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  return {
    user: session?.user ?? null,
    isAuthenticated: session !== null,
    isAdmin: session?.user.role === 'admin',
    login,
    logout,
  }
}
