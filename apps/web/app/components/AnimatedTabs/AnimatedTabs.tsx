import Tabs, { TabsProps } from '@valley/ui/Tabs'
import React, { useCallback, useEffect, useRef } from 'react'
import { HEADER_HEIGHT } from '../../config/constants'
import { map } from '../../utils/misc'
import useMediaQuery from '@valley/ui/useMediaQuery'
import { SMALL_VIEWPORT_WIDTH } from '@valley/ui/config/theme'

const TABS_OFFSET = 48

const AnimatedTabs: React.FC<TabsProps> = ({ children, ...props }) => {
  const $tabs = useRef<HTMLDivElement>(null)
  const shouldAnimate = useMediaQuery(`(min-width:${SMALL_VIEWPORT_WIDTH}px)`)
  const scrollProgressTransitionStyles = useCallback((progress: number) => {
    if ($tabs.current) {
      $tabs.current.style.left = map(progress, 0, 1, 0, TABS_OFFSET) + 'px'
    }
  }, [])

  useEffect(() => {
    if (!shouldAnimate && $tabs.current) {
      $tabs.current.style.left = '0'
    }
  }, [shouldAnimate])

  return (
    <Tabs
      {...props}
      ref={$tabs}
      scrollProgressOffset={HEADER_HEIGHT}
      onScrollProgressChange={
        shouldAnimate ? scrollProgressTransitionStyles : undefined
      }
    >
      {children}
    </Tabs>
  )
}

export default AnimatedTabs
