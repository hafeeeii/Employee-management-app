import React from 'react'
import EmployeeList from './views'
import { getDepartments } from '@/services/department'
import { getDesignations } from '@/services/designation'
import { getWorkLocations } from '@/services/work-location'
import { getEmployees } from '@/services/employee'
import { cookies } from 'next/headers'

const EmployeeListPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) => {
  const queryParams = await searchParams
  const employees = await getEmployees((await cookies()).toString(),queryParams)
  const departments = await getDepartments((await cookies()).toString(),)
  const designations = await getDesignations((await cookies()).toString(),)
  const workLocations = await getWorkLocations((await cookies()).toString(),)


  return <EmployeeList employees={employees} departments={departments} designations={designations} workLocations={workLocations} />
}

export default EmployeeListPage
