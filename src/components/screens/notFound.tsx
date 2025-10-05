import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">Page not found</p>
      <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
        Go back to home
      </Button>
    </div>
  )
}
