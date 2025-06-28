
import prisma from '@/lib/prisma';
import { getValidSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    if (!id) {
        return NextResponse.json({ error: "Designation ID missing" });
    }

    try {
        const session = await getValidSession();
        if (!session.status) {
            return NextResponse.json(session, { status: 401 });
        }
        const businessId = session.data?.businessId as string;

        const designation = await prisma.designation.findUnique({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id
                }

            }
        })
        if (!designation) {
            return NextResponse.json({ error: "Designation not found" });
        }
        return NextResponse.json(designation);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching designation" });
    }
}
