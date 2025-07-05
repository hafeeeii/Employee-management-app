import { EmployeeWithRelations } from "@/lib/types"
import { baseUrl } from "@/lib/utils"
import { toast } from "sonner"


const isServer = typeof window === 'undefined';
const BASE_URL = isServer ? baseUrl + '/api/employees' : '/api/employees';


export const getEmployees = async (cookie: string, queryParams: { [key: string]: string }): Promise<EmployeeWithRelations[]> => {
  const { sortBy, sortOrder, name, email, page, pageSize } = queryParams

  let params = new URLSearchParams()
  if (sortBy) params.append('sortBy', sortBy)
  if (sortOrder) params.append('sortOrder', sortOrder)
  if (name) params.append('name', name)
  if (email) params.append('email', email)
  if (page) params.append('page', page)
  if (pageSize) params.append('pageSize', pageSize)

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: {
        Cookie: cookie
      }
    })
    const data = await res.json()
     console.log(data,'data')
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