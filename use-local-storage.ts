import { useCallback, useEffect, useState } from 'react'
import useEventListener from './use-event-listener'
import useEventCallback from './use-event-callback'

import type { Dispatch, SetStateAction } from 'react'
type SetValue<T> = Dispatch<SetStateAction<T>>
declare global {
	interface WindowEventMap {
		'local-storage': CustomEvent
	}
}

// prettier-ignore
function parseJSON<T>(value: any): T | undefined {
	if(!value) return
	try { return JSON.parse(value ?? '') }
	catch { return value }
}

/**
 * Hook to use localStorage
 * @param {string} key - Storage key
 * @param {Type} initial - Initial value
 * @returns {[Type, SetValue<Type>]} - [value, setValue]
 */
export function useLocalStorage<T>(
	key: string,
	initial: T,
): [T, SetValue<T>] {
	const getValue = useCallback((): T => {
		// error handling for server-side
		if (typeof window === 'undefined') {
			return initial
		}
		try {
			const item = window.localStorage.getItem(key)
			return item ? (parseJSON(item) as T) : initial
		} catch (err) {
			console.warn(`Error reading localStorage key "${key}":`, err)
			return initial
		}
	}, [initial, key])

	const [storedValue, setStoredValue] = useState<T>(getValue())
	// prettier-ignore
	const setValue: SetValue<T> = useEventCallback((value) => {
		if (typeof window === 'undefined') {
			console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`)
		}
		try {
			const newValue = value instanceof Function ? value(storedValue) : value
			window.localStorage.setItem(key, JSON.stringify(newValue))
			setStoredValue(newValue)
			window.dispatchEvent(new Event('local-storage'))
		} catch (err) {
			console.warn(`Error setting localStorage key "${key}":`, err)
		}
	})

	const handleChange = () => setStoredValue(getValue())

	// eslint-disable-next-line
	useEffect(handleChange, [])
	useEventListener('local-storage', handleChange)
	useEventListener('storage', (e) => {
		if (e.key && e.key === key) handleChange
	})

	return [storedValue, setValue]
}

export default useLocalStorage
