import { useEffect, useRef } from 'react'
import { getRoutePath } from '../utils'
import { prefetch } from ".."
import onVisible from '../utils/Visibility'

const usePrefetch = (path, ref = useRef()) => {
  useEffect(() => {
    if (!ref.current) {
      return
    }
    onVisible(ref.current, () => prefetch(getRoutePath(path)))
  }, [ref.current, path])

  return ref
}

export default usePrefetch
