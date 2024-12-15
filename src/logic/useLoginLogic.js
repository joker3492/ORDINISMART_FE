import { useRouter } from 'vue-router'

export default function useLoginLogic() {
  const router = useRouter()

  const goToLogin = () => {
    router.push('/login')
  }

  return { goToLogin }
}
