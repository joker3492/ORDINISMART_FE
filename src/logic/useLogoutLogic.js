import { useAuthStore } from '@/stores/auth'

export default function useLogoutLogic() {
  const auth = useAuthStore()

  const handleLogout = () => {
    auth.logout()
  }

  return { handleLogout }
}
