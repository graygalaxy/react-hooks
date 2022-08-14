import { useState, useRef, useCallback } from 'react'

interface Options {
	enterDelay?: number
	exitDelay?: number
	onUnmount?: () => void
}

/**
 * hook for delaying render & unmount
 * @param { boolean } active
 * @param { Options } options
 * @returns
 */
export function useDelayedRender(
	active: boolean = false,
	options: Options = {}
) {
	const mounted = useRef(active)
	const rendered = useRef(false)
	const renderTimer = useRef<NodeJS.Timeout | null>(null)
	const unmountTimer = useRef<NodeJS.Timeout | null>(null)
	const prevActive = useRef(active)
	// force to recalculate
	const [, force] = useState<any>()

	const recalculate = useCallback(() => {
		const { enterDelay = 1, exitDelay = 0 } = options
		// component will mount
		if (prevActive.current) {
			// Mount Immediately
			mounted.current = true
			if (unmountTimer.current) clearTimeout(unmountTimer.current)
			// Render Immediately
			if (enterDelay <= 0) rendered.current = true
			else if (!renderTimer.current) {
				// Render after a delay
				renderTimer.current = setTimeout(() => {
					rendered.current = true
					renderTimer.current = null
					force({})
				}, enterDelay)
			}
		} else {
			// Immediately set to unrendered
			rendered.current = false
			if (exitDelay <= 0) mounted.current = false
			else if (!unmountTimer.current) {
				// Unmount after a delay
				unmountTimer.current = setTimeout(() => {
					mounted.current = false
					unmountTimer.current = null
					force({})
				}, exitDelay)
			}
		}
	}, [options])

	// When the active prop changes, need to re-calculate
	if (active !== prevActive.current) {
		prevActive.current = active
		recalculate()
	}

	return [mounted.current, rendered.current]
}

export default useDelayedRender
