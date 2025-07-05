import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { businessId } = await req.json()

    if (!businessId) {
        return NextResponse.json({ error: 'Business ID missing' }, { status: 400 })
    }

    const cookieStore = await cookies()
    cookieStore.set('businessId', businessId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    })


    return NextResponse.json({ status: 'ok' })
}
