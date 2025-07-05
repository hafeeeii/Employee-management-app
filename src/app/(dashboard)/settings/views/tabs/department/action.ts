'use server'

import prisma from "@/lib/prisma";
import { departmentSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getBusinessId } from "@/lib/business";

// CREATE
export async function saveDepartment(prevState: any, formData: FormData) {
    const parsed = departmentSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
        return {
            status: false,
            message: "Invalid department",
        };
    }

    const { id, ...rest } = parsed.data;
    try {
        const business = await getBusinessId()

        if (!business.status) {
            return business
        }

        const businessId = business.data as string


        await prisma.department.create({
            data: {
                ...rest,
                tenantId: businessId,
            },
        });

        revalidatePath("/settings");
        return {
            status: true,
            message: "Department created successfully",
        };
    } catch (err: any) {
        return {
            status: false,
            message: "Database error occurred:" + err?.message,
        };
    }
}

// UPDATE
export async function updateDepartment(prevState: any, formData: FormData) {
    const parsed = departmentSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return {
            status: false,
            message: "Please fill all the required fields",
            error: parsed.error.message,
        };
    }

    try {
        const business = await getBusinessId()

        if (!business.status) {
            return business
        }

        const businessId = business.data as string


        await prisma.department.update({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id: parsed.data.id,
                },
            },
            data: parsed.data,
        });

        revalidatePath("/settings");

        return {
            status: true,
            message: "Department updated successfully",
            error: null,
        };
    } catch (err) {
        return {
            status: false,
            message: "Database error occurred",
            error: err,
        };
    }
}

// DELETE
export async function deleteDepartment(id: string) {
    if (!id)
        return {
            status: false,
            message: "Department not found",
            error: null,
        };

    try {
        const business = await getBusinessId()

        if (!business.status) {
            return business
        }

        const businessId = business.data as string

        await prisma.department.delete({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id,
                },
            },
        });

        revalidatePath("/settings");

        return {
            status: true,
            message: "Department deleted successfully",
            error: null,
        };
    } catch (err) {
        return {
            status: false,
            message: "Database error occurred",
            error: err,
        };
    }
}
