import { useCallback, useState } from 'react'
import { ApiError } from '@/lib/http'

type UseAuthFormActionOptions<T> = {
  action: (payload: T) => Promise<void>
  onSuccess: () => void
  fallbackError: string
}

type UseAuthFormActionResult<T> = {
  error: string | null
  isLoading: boolean
  handleSubmit: (payload: T) => Promise<void>
}

export function useAuthFormAction<T>({
  action,
  onSuccess,
  fallbackError,
}: UseAuthFormActionOptions<T>): UseAuthFormActionResult<T> {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(
    async (payload: T) => {
      setIsLoading(true)
      setError(null)

      try {
        await action(payload)
        onSuccess()
      } catch (caught) {
        setError(caught instanceof ApiError ? caught.message : fallbackError)
      } finally {
        setIsLoading(false)
      }
    },
    [action, onSuccess, fallbackError],
  )

  return { error, isLoading, handleSubmit }
}
