import { ExternalLink, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { TenantUserWithRelations } from '@/lib/types'


interface BusinessCardProps {
  business: TenantUserWithRelations
  onRedirect: (domain: string, businessId: string) => void
}

export function BusinessCard({ business, onRedirect }: BusinessCardProps) {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'manager':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'member':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className='group flex flex-col justify-between overflow-hidden'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='rounded-lg bg-blue-50 p-2'>
              <Building2 className='h-5 w-5 text-blue-600' />
            </div>
            <div>
              <h3 className='text-lg font-semibold '>{business.tenant?.name}</h3>
              <p className='text-sm text-gray-500'>{business.tenant?.subdomain}</p>
            </div>
          </div>
          <Badge className={`${getRoleColor(business.role)} font-medium`}>{business.role}</Badge>
        </div>
      </CardHeader>
      <CardFooter className='pt-0'>
        <Button onClick={() => onRedirect(business.tenant?.subdomain, business.tenantId)} className='group w-full font-medium'>
          Access Business
          <ExternalLink className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
        </Button>
      </CardFooter>
    </Card>
  )
}
