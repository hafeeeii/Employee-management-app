import { Designation } from '@prisma/client'
import { baseUrl } from "@/lib/utils"
import { toast } from "sonner"

const isServer = typeof window === 'undefined';
const BASE_URL = isServer ? baseUrl + '/api/designations' : '/api/designations';


export const getDesignations = async ( cookie:string, queryParams?: { [key: string]: string },): Promise<Designation[]> => {

  let params = new URLSearchParams()
  if (queryParams) {
    const { sortBy, sortOrder, name, page, pageSize } = queryParams
    if (sortBy) params.append('sortBy', sortBy)
    if (sortOrder) params.append('sortOrder', sortOrder)
    if (name) params.append('name', name)
    if (page) params.append('page', page)
    if (pageSize) params.append('pageSize', pageSize)
  }

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers:{
        Cookie: cookie
      }
    })
    const data = await res.json()
    return data
  } catch (error) {
    toast.error('Error fetching designation')
    return []
  }
}


export const getDesignation = async (id: string): Promise<Designation | null> => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`,)
    const data = await res.json()
    return data
  } catch (error) {
    toast.error('Error fetching designation')
    return null
  }
}