import { useEffect, useLayoutEffect } from 'react'

const isServer = typeof window === 'undefined'
const useIsomorphicEffect = isServer ? useEffect : useLayoutEffect

export { useIsomorphicEffect }
export default useIsomorphicEffect
