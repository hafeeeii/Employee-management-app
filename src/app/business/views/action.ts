'use server'

import prisma from "@/lib/prisma"
import { createSession, decrypt, getValidSession, User } from "@/lib/session"
import { BusinessSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"


export async function saveBusiness(prevState: any,
    formData: FormData
) {

    const parsed = BusinessSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return {
            status: false,
            message: 'Invalid business data'
        }
    }

    const { name, subdomain, ownerId } = parsed.data
    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    try {
        const existingTenant = await prisma.tenant.findUnique({
            where: { subdomain: sanitizedSubdomain }
        });

        if (existingTenant) {
            return {
                status: false,
                message: 'Subdomain already taken. Please choose another.'
            };
        }

        const user = await prisma.user.findUnique({
            where: { id: ownerId },
        });


        if (!user) {
            return {
                status: false,
                message: 'User does not exist.'
            };
        }

        await prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: name,
                    subdomain: sanitizedSubdomain
                }
            })

            await tx.tenantUser.create({
                data: {
                    userId: ownerId,
                    tenantId: tenant.id,
                    role: 'OWNER'
                }
            })

            return tenant;
        })

    } catch (err: any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
        }
    }

    revalidatePath('/business')
    return {
        status: true,
        message: 'Business created successfully'
    }
}

export async function switchBusiness(businessId: string) {

 const cookieStore = await cookies()
   const cookie = cookieStore.get('session')?.value
 
 
   let session = null
   if (!cookie) {
     return {
       status: false,
       message: 'Session expired, please login again',
       error: null,
       data: null
     }
   }
 
   session = await decrypt(cookie);
 
 
   if (!(session as User)?.userId) {
     return {
       status: false,
       message: 'Session expired, please login again',
       error: null,
       data: null
     }
   }

    const sessionType = session as User
    const userId = sessionType?.userId ;
    const originalExpires = sessionType?.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days if not set

    try {
        await createSession(userId, businessId, originalExpires)
        return {
            status: true,
            message: 'Session updated successfully',
            error: null
        }
    } catch (err: any) {
        return {
            status: false,
            message: 'Filed to switch business ',
            error: null
        }
    }


}

// export async function updateDesignation(prevState: any, formData: FormData) {
//     const parsed = designationSchema.safeParse(Object.fromEntries(formData))
//     if (!parsed.success) {
//         return {
//             status: false,
//             message: 'Please fill all the required fields',
//             error: parsed.error.message
//         }
//     }

//     try {
//         await prisma.designation.update({
//             where: {
//                 id: parsed.data.id
//             },
//             data: parsed.data
//         })
//     } catch (err:any) {
//         return {
//             status: false,
//             message: 'Data base error occurred: ' + err?.message,
//             error: err
//         }
//     }
//     revalidatePath('/settings')

//     return {
//         status: true,
//         message: 'Designation updated successfully',
//         error: null
//     }
// }

// export async function deleteDesignation(id:string) {
//     if (!id) return {
//         status: false,
//         message: 'Designation not found',
//         error: null
//     }

//     try {
//         await prisma.designation.delete({
//             where: {
//                 id: id
//             },
//         })
//     } catch (err:any) {
//         return {
//             status: false,
//             message: 'Data base error occurred: ' + err?.message,
//             error: err
//         }
//     }
//      revalidatePath('/settings')

//     return {
//         status: true,
//         message: 'Designation deleted successfully',
//         error: null
//     }
// }
