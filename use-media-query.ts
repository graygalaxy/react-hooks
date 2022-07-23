import { useEffect, useState } from 'react'

/**
 * Get the current media query state
 * @param {boolean} query - Media Query
 * @returns {boolean}
 */
export function useMediaQuery(
	query: string
): boolean {
	const getMatches = (query: string): boolean => {
		if (typeof window === 'undefined')
			return false
		return window.matchMedia(query).matches
	}

	const [matches, setMatches] = useState<boolean>(getMatches(query))
	const handleChange = () => setMatches(getMatches(query))

	useEffect(() => {
		const matchMedia = window.matchMedia(query)
		handleChange()
		matchMedia.addEventListener('change', handleChange)
		return () => {
			matchMedia.removeEventListener('change', handleChange)
		}
		// eslint-disable-next-line
	}, [query])

	return matches
}

export default useMediaQuery
