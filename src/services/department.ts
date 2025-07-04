
import { Department } from '@prisma/client'
import { baseUrl } from "@/lib/utils"
import { toast } from "sonner"

const isServer = typeof window === 'undefined';
const BASE_URL = isServer ? baseUrl + '/api/departments' : '/api/departments';
export const getDepartments = async ( cookie:string,queryParams?: { [key: string]: string }): Promise<Department[]> => {

  let params = new URLSearchParams()
  if (queryParams) {
    const { sortBy, sortOrder, name,code, page, pageSize } = queryParams
    if (sortBy) params.append('sortBy', sortBy)
    if (sortOrder) params.append('sortOrder', sortOrder)
    if (name) params.append('name', name)
    if (code) params.append('code', code)
    if (page) params.append('page', page)
    if (pageSize) params.append('pageSize', pageSize)
  }

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
    toast.error('Error fetching department')
    return []
  }
}


export const getDepartment = async (id: string): Promise<Department | null> => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    toast.error('Error fetching department')
    return null
  }
}