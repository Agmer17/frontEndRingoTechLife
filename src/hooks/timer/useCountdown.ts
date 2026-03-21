import { useEffect, useState } from "react"

export function useCountdown(expiresAt: string) {
    const target = new Date(expiresAt).getTime()

    const [timeLeft, setTimeLeft] = useState<number>(
        target - Date.now()
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(target - Date.now())
        }, 1000)

        return () => clearInterval(interval)
    }, [target])

    const expired = timeLeft <= 0

    const hours = Math.max(0, Math.floor(timeLeft / 1000 / 60 / 60))
    const minutes = Math.max(0, Math.floor((timeLeft / 1000 / 60) % 60))
    const seconds = Math.max(0, Math.floor((timeLeft / 1000) % 60))

    return { hours, minutes, seconds, expired }
}