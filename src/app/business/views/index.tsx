import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cookies } from 'next/headers'
import { decrypt, User } from '@/lib/session'
import { getUser } from '@/services/user'
import { UserWithRelations } from '@/lib/types'
import { BusinessList } from './business-list'

const Business = async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value

  if (!cookie) {
    return (
      <Card>
        <CardContent>
          <p>Please login to create a business.</p>
        </CardContent>
      </Card>
    )
  }
  
  const session = await decrypt(cookie) 

  if (!(session as User).userId) {
    return (
      <Card>
        <CardContent>
          <p>Please login to create a business.</p>
        </CardContent>
      </Card>
    )
  }

  const user = await getUser((session as User).userId) 

  return (
    <div className='p-4' >
        <BusinessList businesses={user?.tenantUser}/>
    </div>
  )
}

export default Business
