'use server'
import prisma from "@/lib/prisma"
import { getValidSession } from "@/lib/session"
import { EmployeeSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"




export async function saveEmployee(prevState: any, formData: FormData) {
    const parsed = EmployeeSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    try {
        const session = await getValidSession()
        if (!session.status) {
            return session
        }

        const businessId = session.data?.businessId as string
        await prisma.employee.create({
            data: {
                ...parsed.data,
                tenantId: businessId
            }
        })
    } catch (err:any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
    revalidatePath('/employee/list')

    return {
        status: true,
        message: 'Employee created successfully',
        error: null
    }

}

export async function updateEmployee(prevState: any, formData: FormData) {
    const parsed = EmployeeSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    try {
        const session = await getValidSession()
        if (!session.status) {
            return session
        }
        const businessId = session.data?.businessId as string
        await prisma.employee.update({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id: parsed.data.id
                }
            },
            data: parsed.data
        })
    } catch (err:any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
    revalidatePath('/employee/list')

    return {
        status: true,
        message: 'Employee updated successfully',
        error: null
    }
}

export async function deleteEmployee(id: string) {
    if (!id) return {
        status: false,
        message: 'Employee not found',
        error: null
    }

    try {
        const session = await getValidSession()
        if (!session.status) {
            return session
        }
        const businessId = session.data?.businessId as string
        await prisma.employee.delete({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id
                }
            },
        })
    } catch (err:any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
    revalidatePath('/employee/list')

    return {
        status: true,
        message: 'Employee deleted successfully',
        error: null
    }
}

