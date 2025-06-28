
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    if (!id) {
        return NextResponse.json({ error: "User ID missing" });
    }

    try {
        const user = await prisma.user.findUnique({
            include:{
              tenantUser:{
                include:{
                    tenant:true,
                    user:true,
                }
              }
            },
            where: {
                id: id,
            },
        })
        if (!user) {
            return NextResponse.json({ error: "User not found" });
        }
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching user" });
    }
}
