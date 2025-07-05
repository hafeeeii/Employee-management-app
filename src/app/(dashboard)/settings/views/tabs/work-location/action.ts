'use server'

import { getBusinessId } from "@/lib/business"
import prisma from "@/lib/prisma"
import { workLocationSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function saveWorkLocation(prevState: any,
    formData: FormData
) {

    const parsed = workLocationSchema.safeParse(Object.fromEntries(formData))


    if (!parsed.success) {
        return {
            status: false,
            message: 'Invalid work location'
        }
    }

    const { id, ...rest } = parsed.data

    try {
        const business = await getBusinessId()

        if (!business.status) {
            return business
        }

        const businessId = business.data as string

        await prisma.workLocation.create({
            data: {
                ...rest,
                tenantId: businessId
            }
        })
    } catch (err: any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
        }
    }

    revalidatePath('/settings')
    return {
        status: true,
        message: 'Work location created successfully'
    }
}

export async function updateWorkLocation(prevState: any, formData: FormData) {
    const parsed = workLocationSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    try {
        const business = await getBusinessId()

        if (!business.status) {
            return business
        }

        const businessId = business.data as string

        await prisma.workLocation.update({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id: parsed.data.id
                }
            },
            data: parsed.data
        })
    } catch (err: any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
    revalidatePath('/settings')

    return {
        status: true,
        message: 'Work location updated successfully',
        error: null
    }
}

export async function deleteWorkLocation(id: string) {
    if (!id) return {
        status: false,
        message: 'Work location not found',
        error: null
    }

    try {
        const business = await getBusinessId()

        if (!business.status) {
            return business
        }

        const businessId = business.data as string

        await prisma.workLocation.delete({
            where: {
                tenantId: businessId,
                id
            },
        })
    } catch (err: any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
    revalidatePath('/settings')

    return {
        status: true,
        message: 'Work location deleted successfully',
        error: null
    }
}
