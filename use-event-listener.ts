import { useEffect, useRef } from 'react'

import type { RefObject } from 'react'

// Windows Event based interface
export function useEventListener<
	EW extends keyof WindowEventMap
>(
	event_name: EW,
	callback: (event: WindowEventMap[EW]) => void,
	element?: undefined,
): void
// HTML Elementh Based interface
export function useEventListener<
	EH extends keyof HTMLElementEventMap,
	T extends HTMLElement = HTMLDivElement,
>(
	event_name: EH,
	handler: (event: HTMLElementEventMap[EH]) => void,
	element: RefObject<T>,
): void
// Document Event based interface
export function useEventListener<ED extends keyof DocumentEventMap>(
	event_name: ED,
	callback: (event: DocumentEventMap[ED]) => void,
	element: RefObject<Document>,
): void

/**
 * Hook to use event listener
 * @param event_name - Window or Element event name
 * @param callback - Callback function
 * @param element - Element to attach event listener to
 */
export function useEventListener<
	EW extends keyof WindowEventMap,
	EH extends keyof HTMLElementEventMap,
	T extends HTMLElement = HTMLDivElement,
>(
	event_name: EW,
	callback: (
		event: WindowEventMap[EW] | HTMLElementEventMap[EH] | Event,
	) => void,
	element?: RefObject<T>,
) {
	// Create a ref that stores handler
	const handler = useRef(callback)

	useEffect(() => {
		// Define the listening target
		const targetElement: T | Window = element?.current || window
		if (!(targetElement && targetElement.addEventListener)) {
			return
		}
		// Add event listener
		const eventListener: typeof callback = (event) => {
			if (!!handler?.current) handler.current(event)
		}
		targetElement.addEventListener(event_name, eventListener)
		return () => {
			targetElement.removeEventListener(event_name, eventListener)
		}
	}, [event_name, element, callback])
}

export default useEventListener
