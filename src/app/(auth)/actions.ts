'use server'

import prisma from "@/lib/prisma"
import { createSession, deleteSession } from "@/lib/session"
import { LoginSchema, SignUpSchema } from "@/lib/types"
import { redirect } from "next/navigation"
import bcrypt from "bcrypt"


export async function signUp(prevState: any, formData: FormData) {
    const parsed = SignUpSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return {
            status: false,
            message: 'Invalid credentials'
        }
    }

    const { email } = parsed.data

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (user?.id) {
            return {
                status: false,
                message: 'Email already exists'
            }
        }

        const newUser = await prisma.user.create({
            data: {
                email: parsed.data.email,
                name: parsed.data.name,
                passwordHash: await bcrypt.hash(parsed.data.password, 10),
            }
        })

        await createSession(newUser.id)
    } catch (err:any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: null
        }
    }

    redirect('/dashboard')

}

export async function login(prevState: any, formData: FormData) {
    const result = LoginSchema.safeParse(Object.fromEntries(formData))
    if (!result.success) {
        return {
            status: false,
            message: 'Invalid credentials'
        }
    }

    const { email, password } = result.data

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return {
                status: false,
                message: 'No user found'
            }
        }

        const isValidPassword = await bcrypt.compare(password, user?.passwordHash)

        if (!isValidPassword) {
            return {
                status: false,
                message: 'Invalid email or password'
            }
        }

        await createSession(user.id)
    } catch (err) {
        return {
            status: false,
            message: 'Data base error occurred' + err,
            error: null
        }
    }
    redirect('/dashboard')
}

export async function logout() {
    await deleteSession()
    redirect('/login')
}