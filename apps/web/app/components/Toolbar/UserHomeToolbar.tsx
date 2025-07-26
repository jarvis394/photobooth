import React, { useMemo } from 'react'
import AnimatedTabs from '../AnimatedTabs/AnimatedTabs'
import { ToolbarItem } from './ToolbarItem'
import LinkTabItem from './LinkTabItem'
import { useLocation } from 'react-router'

const userHomeToolbarItems: ToolbarItem[] = [
  {
    label: 'Projects',
    value: '/projects',
  },
  {
    label: 'Profile',
    value: '/account/profile',
  },
  {
    label: 'Analytics',
    value: '/analytics',
  },
  {
    label: 'Settings',
    value: '/settings',
  },
]

const UserHomeToolbar = () => {
  const location = useLocation()
  const value = useMemo(() => {
    if (location.pathname.startsWith('/settings')) {
      return '/settings'
    }

    return location.pathname
  }, [location.pathname])

  return (
    <div className="bg-paper border-alpha-transparent-12 sticky -top-[0.01px] z-10 flex border-b-1">
      <AnimatedTabs value={value} className="px-2 sm:px-4">
        {userHomeToolbarItems.map((tab, i) => (
          <LinkTabItem key={i} value={tab.value} label={tab.label} />
        ))}
      </AnimatedTabs>
    </div>
  )
}

export default UserHomeToolbar
