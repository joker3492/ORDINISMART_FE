import { useRouter } from 'vue-router'

export default function useRegisterLogic() {
  const router = useRouter()

  const goToRegister = () => {
    router.push('/register')
  }

  return { goToRegister }
}
