'use server'

import { getValidSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { departmentSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";

// CREATE
export async function saveDepartment(prevState: any, formData: FormData) {
    const result = departmentSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            status: false,
            message: "Invalid department",
        };
    }

    try {
        const session = await getValidSession();
        if (!session.status) return session;

        const businessId = session.data?.businessId as string;


        await prisma.department.create({
            data: {
                ...result.data,
                tenantId: businessId,
            },
        });

        revalidatePath("/settings");
        return {
            status: true,
            message: "Department created successfully",
        };
    } catch (err) {
        return {
            status: false,
            message: "Database error occurred",
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
        const session = await getValidSession();
        if (!session.status) return session;

        const businessId = session.data?.businessId as string;


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
        const session = await getValidSession();
        if (!session.status) return session;

        const businessId = session.data?.businessId as string;

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
