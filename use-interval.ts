import { useEffect, useRef } from 'react'
import { useIsomorphicEffect } from './use-isomorphic-effect'

/**
 * Use interval without rerendering issue
 * @param {()=>void} callback
 * @param {number} delay
 */
export function useInterval(
	callback: () => void,
	delay: number | null
) {
	const handler = useRef(callback)

	// update the callback if it changes
	useEffect(() => {
		handler.current = callback
	}, [callback])

	useEffect(() => {
		if (!delay && delay !== 0) return
		let instance = setInterval(handler.current, delay)
		return () => clearInterval(instance)
	}, [delay])
}

export default useInterval
