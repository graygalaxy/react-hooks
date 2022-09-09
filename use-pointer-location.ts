import { useState } from 'react'
import type { RefObject } from 'react'
import useEventListener from './use-event-listener'

type Options = {
	factor?: number
	delay?: number
}

/**
 * Finds the position of the mouse pointer
 * @param {RefObject<HTMLElement>} element
 * @param {Options} options
 * @returns [ posX , posY ]
 */
export function usePointerLocation(
	element: RefObject<HTMLElement>,
	options: Options = {},
) {
	const { factor = 1, delay = 0 } = options
	const [point, setPoint] = useState([0, 0])

	const findPosition = ({ clientX, clientY }: MouseEvent) => {
		if (!element.current) return
		const el = element.current!
		const posX = clientX - el.offsetLeft - el.offsetWidth / 2
		const posY = clientY - el.offsetTop - el.offsetHeight / 2
		setPoint([posX * factor, posY * factor])
	}
	useEventListener('pointermove', findPosition)
	return point
}

export default usePointerLocation
