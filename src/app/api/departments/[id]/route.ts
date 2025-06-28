
import prisma from '@/lib/prisma';
import { getValidSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    if (!id) {
        return NextResponse.json({ error: "Department ID missing" });
    }

    try {
        const session = await getValidSession();
        if (!session.status) {
            return NextResponse.json(session, { status: 401 });
        }
        const businessId = session.data?.businessId as string;

        const department = await prisma.department.findUnique({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id
                }
            }
        })
        if (!department) {
            return NextResponse.json({ error: "department not found" });
        }
        return NextResponse.json(department);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching department" });
    }
}
