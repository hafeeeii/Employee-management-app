'use server'
import { getBusinessInfo } from "@/lib/business"
import prisma from "@/lib/prisma"
import { EmployeeSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function saveEmployee(prevState: unknown, formData: FormData) {
    const parsed = EmployeeSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    const { id, ...rest } = parsed.data
    void id

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string

        await prisma.employee.create({
            data: {
                ...rest,
                tenantId: businessId
            }
        })

        revalidatePath('/employee')

        return {
            status: true,
            message: 'Employee created successfully',
            error: null
        }
    } catch (error) {
          const err = error as Error
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }

}

export async function updateEmployee(prevState: unknown, formData: FormData) {
    const parsed = EmployeeSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string

        await prisma.employee.update({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id: parsed.data.id
                }
            },
            data: parsed.data
        })

        revalidatePath('/employee')

        return {
            status: true,
            message: 'Employee updated successfully',
            error: null
        }
    } catch (error) {
          const err = error as Error
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
}

export async function deleteEmployee(id: string) {
    if (!id) return {
        status: false,
        message: 'Employee not found',
        error: null
    }

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string
        await prisma.employee.delete({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id
                }
            },
        })
        revalidatePath('/employee')

        return {
            status: true,
            message: 'Employee deleted successfully',
            error: null
        }
    } catch (error) {
          const err = error as Error
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }

}

