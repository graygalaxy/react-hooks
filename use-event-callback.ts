import { useLayoutEffect, useCallback, useRef } from 'react'

/**
 * Simplified version of useCallback in react
 * @param callback - function call
 */
export function useEventCallback<A extends unknown[], R>(
	callback: (...args: A) => R,
) {
	const ref = useRef<typeof callback>(() => {
		throw new Error('Cannot call an event handler while rendering.')
	})

	useLayoutEffect(() => {
		ref.current = callback
	})

	return useCallback((...args: A) => ref.current(...args), [ref])
}

export default useEventCallback
