'use client'

import { useEffect, useState } from 'react'

import { BadgeCheck, Bell, BriefcaseBusiness, CreditCard, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu'
import { baseUrl, cn, getInitials } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Badge } from './badge'
import { getUnreadNotificationsCount } from '@/services/user'

export function AccountMenu({
  users
}: {
  readonly users: ReadonlyArray<{
    readonly id: string
    readonly name: string
    readonly email: string
    readonly avatar: string
    readonly role: string
  }>
}) {
  const [activeUser, setActiveUser] = useState(users[0])
  const [notificationsCount, setNotificationsCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
   const interval = setInterval(() => {
     getUnreadNotificationsCount().then(count => {
      console.count('thisis count')
      setNotificationsCount(count ?? 0);
    })
   }, 10000);

   return () => clearInterval(interval)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='size-9 cursor-pointer rounded-lg'>
          <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.name} />
          <AvatarFallback className='rounded-lg'>{getInitials(activeUser.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-56 space-y-1 rounded-lg' side='bottom' align='end' sideOffset={4}>
        {users.map(user => (
          <DropdownMenuItem
            key={user.email}
            className={cn('p-0', user.id === activeUser.id && 'border-l-2 border-l-primary bg-accent/50')}
            onClick={() => setActiveUser(user)}
          >
            <div className='flex w-full items-center justify-between gap-2 px-1 py-1.5'>
              <Avatar className='size-9 rounded-lg'>
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback className='rounded-lg'>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user.name}</span>
                <span className='truncate text-xs capitalize'>{user.role}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`${baseUrl}/business`)} className='cursor-pointer'>
            <BriefcaseBusiness />
            Business
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/notifications`)} className='relative cursor-pointer'>
            <Bell />
            Notifications
            <Badge className='absolute right-2 h-5 min-w-5 rounded-full font-mono tabular-nums' variant='destructive'>
              {notificationsCount}
            </Badge>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
