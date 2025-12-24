import { useCallback, useEffect, useRef } from 'react'

interface Options {
  rootMargin?: string
  threshold?: number
  enabled?: boolean
}

function useInfiniteScroll(callback: () => void, { rootMargin = '200px', threshold = 0.1, enabled = true }: Options = {}) {
  const observer = useRef<IntersectionObserver | null>(null)
  const targetRef = useRef<HTMLDivElement | null>(null)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && enabled) {
        callback()
      }
    },
    [callback, enabled],
  )

  useEffect(() => {
    if (observer.current)
      observer.current.disconnect()

    observer.current = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold,
    })

    if (targetRef.current) {
      observer.current.observe(targetRef.current)
    }

    return () => observer.current?.disconnect()
  }, [handleIntersect, rootMargin, threshold])

  const setRef = (node: HTMLDivElement | null) => {
    targetRef.current = node
    if (node && observer.current)
      observer.current.observe(node)
  }

  return { targetRef: setRef }
}

export default useInfiniteScroll
