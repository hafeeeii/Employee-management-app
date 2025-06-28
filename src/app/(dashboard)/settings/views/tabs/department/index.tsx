'use client'
import { SharedTable } from '@/components/shared-table'
import React from 'react'
import Form from './form'
import { Department} from '@prisma/client'
import { getDepartment } from '@/services/department'
import { deleteDepartment } from './action'

type DepartmentTabProps = {
  departments: Department[]
}

const DepartmentTab =  ({ departments }: DepartmentTabProps) => {
  const [showForm, setShowForm] = React.useState(false)
  const [department, setDepartment] = React.useState<Department | null>(null)

  const toggleForm = () => {
    setShowForm(!showForm)
    if (showForm) {
      setDepartment(null)
    }
  }



  type TableData = {
    editMode: 'toggle' | 'redirect'
    columnData: {
      header: string
      accessorKey: keyof (Department[])[number]
      sortable?: boolean
      filterable?: boolean
    }[]
    data: Department[]
  }

  const tableData: TableData = {
    editMode: 'toggle',
    columnData: [
      { header: 'Name', accessorKey: 'name', sortable: true, filterable: true },
      { header: 'Code', accessorKey: 'code', sortable: true, filterable: true },
      { header: 'Description', accessorKey: 'description' },
      {header:'Total Employees', accessorKey:'totalEmployees'}
    ],
    data: departments ?? []
  }

  const onEdit = async (id: string) => {
    if (!id) return null
    const department = await getDepartment(id)
    setDepartment(department)
    toggleForm()
  }
  

  return (
    <div className='flex flex-col items-end gap-6'>
      <Form
        department={department}
        showForm={showForm}
        toggleForm={toggleForm}
      />
      <SharedTable tableData={tableData} onEdit={onEdit} onDelete={deleteDepartment}/>
    </div>
  )
}

export default DepartmentTab
