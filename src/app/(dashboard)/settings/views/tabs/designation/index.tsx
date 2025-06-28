'use client'
import { SharedTable } from '@/components/shared-table'
import React from 'react'
import Form from './form'
import { getDesignation } from '@/services/designation'
import { Designation } from '@prisma/client'
import { deleteDesignation } from './action'

type DesignationTabProps = {
  designations: Designation[]
}

const DesignationTab = ({ designations }: DesignationTabProps) => {
  const [showForm, setShowForm] = React.useState(false)
  const [designation, setDesignation] = React.useState<Designation | null>(null)

  const toggleForm = () => {
    setShowForm(!showForm)
    if (showForm) {
      setDesignation(null)
    }
  }

  type TableData = {
    editMode: 'toggle' | 'redirect'
    columnData: {
      header: string
      accessorKey: keyof Designation[][number]
      sortable?: boolean
      filterable?: boolean
    }[]
    data: Designation[]
  }

  const tableData: TableData = {
    editMode: 'toggle',
    columnData: [
      { header: 'Name', accessorKey: 'name', sortable: true, filterable: true },
      { header: 'Total Employees', accessorKey: 'totalEmployees' }
    ],
    data: designations ?? []
  }

  const onEdit = async (id: string) => {
    if (!id) return null
    const designation = await getDesignation(id)
    setDesignation(designation)
    toggleForm()
  }

  return (
    <div className='flex flex-col items-end gap-6'>
      <Form designation={designation} showForm={showForm} toggleForm={toggleForm} />
      <SharedTable tableData={tableData} onEdit={onEdit} onDelete={deleteDesignation}/>
    </div>
  )
}

export default DesignationTab
