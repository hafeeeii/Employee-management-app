'use client'
import { SharedTable } from '@/components/shared-table'
import React from 'react'
import Form from './form'
import { getEmployee } from '@/services/employee'
import { Department, Designation, Employee, WorkLocation } from '@prisma/client'
import { EmployeeWithRelations } from '@/lib/types'
import { deleteEmployee } from './action'

type EmployeeListProps = {
  employees?: EmployeeWithRelations[]
  departments?: Department[]
  designations?: Designation[]
  workLocations?: WorkLocation[]
}

const EmployeeList =  ({ employees, departments, designations, workLocations }: EmployeeListProps) => {
  const [showForm, setShowForm] = React.useState(false)
  const [employee, setEmployee] = React.useState<Employee | null>(null)

  const toggleForm = () => {
    setShowForm(!showForm)
    if (showForm) {
      setEmployee(null)
    }
  }

  const processedEmployees =
    employees?.map(employee => {
      return {
        ...employee,
        departmentName: employee.departmentMeta?.name || '',
        designationName: employee.designationMeta?.name || '',
        workLocationName: employee.workLocationMeta?.name || ''
      }
    }) ?? []

  type TableData = {
    editMode: 'toggle' | 'redirect'
    columnData: {
      header: string
      accessorKey: keyof (typeof processedEmployees)[number]
      sortable?: boolean
      filterable?: boolean
    }[]
    data: typeof processedEmployees
  }

  const tableData: TableData = {
    editMode: 'toggle',
    columnData: [
      { header: 'Name', accessorKey: 'name', sortable: true, filterable: true },
      { header: 'Email', accessorKey: 'email', sortable: true, filterable: true },
      { header: 'Department', accessorKey: 'departmentName' },
      { header: 'Designation', accessorKey: 'designationName' },
      { header: 'Work Location', accessorKey: 'workLocationName' }
      // { header: "Phone", accessorKey: "phone" },
    ],
    data: processedEmployees
  }

  const onEdit = async (id: string) => {
    if (!id) return null
    const employee = await getEmployee(id)
    setEmployee(employee)
    toggleForm()
  }
  

  return (
    <div className='flex flex-col items-end gap-6'>
      <Form
        departments={departments}
        designations={designations}
        workLocations={workLocations}
        showForm={showForm}
        employee={employee}
        toggleForm={toggleForm}
      />
      <SharedTable tableData={tableData} onEdit={onEdit} onDelete={deleteEmployee}/>
    </div>
  )
}

export default EmployeeList
