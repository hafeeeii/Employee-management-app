import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getValidSession } from "@/lib/session";

const validSortFields = ['name', 'code'];
const validSortOrders = ['asc', 'desc'];

export async function GET(request: NextRequest) {

  try {
    const searchParams = request.nextUrl.searchParams
    const sortByParam = searchParams.get('sortBy') || 'name'
    const sortOrderParam = searchParams.get('sortOrder') || 'asc'
    const name = searchParams.get('name')
    const code = searchParams.get('code')
    const page = searchParams.get('page') || '0'
    const pageSize = searchParams.get('pageSize') || '10'


    const sortBy = validSortFields.includes(sortByParam) ? sortByParam : 'name'
    const sortOrder = validSortOrders.includes(sortOrderParam.toLowerCase()) ? sortOrderParam : 'asc'

    const session = await getValidSession();
    if (!session.status) {
      return NextResponse.json(session, { status: 401 });
    }
    const businessId = session.data?.businessId as string;


    const departments = await prisma.department.findMany({
      skip: parseInt(page) * parseInt(pageSize),
      take: parseInt(pageSize),
      include: {
        employees: true
      },
      where: {
        ...(name && { name: { contains: name } }),
        ...(code && { code: { contains: code } }),
        tenantId: businessId
      },
      orderBy: [
        {
          [sortBy]: sortOrder
        }
      ],
    });
    const udpatedDepartments = departments.map((item) => ({
      ...item,
      totalEmployees: item.employees.length
    }))

    return NextResponse.json(udpatedDepartments);
  } catch (error) {
    console.error(error, "Error fetching departments");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


