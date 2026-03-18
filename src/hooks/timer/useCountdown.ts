import { useEffect, useState } from "react"

export function useCountdown(expiresAt: string) {

    const [timeLeft, setTimeLeft] = useState<number>(
        new Date(expiresAt.replace("Z", "")).getTime() - Date.now()
    )

    useEffect(() => {

        const interval = setInterval(() => {
            setTimeLeft(new Date(expiresAt).getTime() - Date.now())
        }, 1000)

        return () => clearInterval(interval)

    }, [expiresAt])

    const expired = timeLeft <= 0

    const hours = Math.max(0, Math.floor(timeLeft / 1000 / 60 / 60))
    const minutes = Math.max(0, Math.floor((timeLeft / 1000 / 60) % 60))
    const seconds = Math.max(0, Math.floor((timeLeft / 1000) % 60))

    return { hours, minutes, seconds, expired }

}