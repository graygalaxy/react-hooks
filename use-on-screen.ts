import { useEffect, useState } from 'react'

import type { MutableRefObject } from 'react'

/**
 * Hook to check if an element is visible on screen
 * @param {MutableRefObject} ref - Element reference
 * @param {number} margin - Screen Margin to trigger the callback
 * @returns {boolean} - Returns true if the element is in view
 */
export function useOnScreen<T extends Element>(
	ref: MutableRefObject<T>,
	margin: number = 0
): boolean {
	const [isVisible, setIsVisible] = useState<boolean>(false)

	useEffect(() => {
		if (!ref.current) return

		const rootMargin = `${margin}px`
		const observer = new IntersectionObserver(([entry]) => {
			setIsVisible(entry.isIntersecting)
		}, { rootMargin })
		observer.observe(ref.current)

		return () => {
			if (!ref.current) return
			observer.unobserve(ref.current)
		}
	}, [ref.current, margin])
	return isVisible
}

export default useOnScreen
