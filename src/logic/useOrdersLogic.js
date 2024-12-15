import { useRouter } from 'vue-router'

export default function useOrdersLogic() {
  const router = useRouter()

  const goToDashboard = () => {
    router.push('/dashboard') // Indirizza alla dashboard
  }

  return { goToDashboard }
}
