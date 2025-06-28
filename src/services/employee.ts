import { EmployeeWithRelations } from "@/lib/types"
import { baseUrl } from "@/lib/utils"
import { toast } from "sonner"

const BASE_URL = baseUrl + '/api/employees'

export const getEmployees = async (queryParams: { [key: string]: string }): Promise<EmployeeWithRelations[]> => {
  const { sortBy, sortOrder, name, email, page, pageSize } = queryParams

  let params = new URLSearchParams()
  if (sortBy) params.append('sortBy', sortBy)
  if (sortOrder) params.append('sortOrder', sortOrder)
  if (name) params.append('name', name)
  if (email) params.append('email', email)
  if (page) params.append('page', page)
  if (pageSize) params.append('pageSize', pageSize)

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`)
    const data = await res.json()
    return data
  } catch (error) {
    toast.error('Error fetching employees')
    return []
  }
}


export const getEmployee = async (id:string):Promise<EmployeeWithRelations | null> => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    toast.error('Error fetching employee')
    return null
  }
}