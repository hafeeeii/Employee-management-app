import React from 'react'

const SubdomainPage = async ({ params }:{
    params:Promise<{subdomain:string}>
}) => {
    const {subdomain} = await params
    
  return (
    <div>SubdomainPage</div>
  )
}

export default SubdomainPage