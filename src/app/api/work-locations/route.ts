import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getBusinessId } from "@/lib/business";

const validSortFields = ['name'];
const validSortOrders = ['asc', 'desc'];

export async function GET(request: NextRequest) {

  try {
    const searchParams = request.nextUrl.searchParams
    const sortByParam = searchParams.get('sortBy') || 'name'
    const sortOrderParam = searchParams.get('sortOrder') || 'asc'
    const name = searchParams.get('name')
    const page = searchParams.get('page') || '0'
    const pageSize = searchParams.get('pageSize') || '10'


    const sortBy = validSortFields.includes(sortByParam) ? sortByParam : 'name'
    const sortOrder = validSortOrders.includes(sortOrderParam.toLowerCase()) ? sortOrderParam : 'asc'


    const business = await getBusinessId()

    if (!business.status) {
      return NextResponse.json(business, { status: 401 });
    }

    const businessId = business.data as string


    const workLocations = await prisma.workLocation.findMany({
      skip: parseInt(page) * parseInt(pageSize),
      take: parseInt(pageSize),
      include: {
        employees: true
      },
      where: {
        ...(name && { name: { contains: name } }),
        tenantId: businessId
      },
      orderBy: [
        {
          [sortBy]: sortOrder
        }
      ],
    });
    const udpatedWorkLocations = workLocations.map((item) => ({
      ...item,
      totalEmployees: item.employees.length
    }))

    return NextResponse.json(udpatedWorkLocations);
  } catch (error) {
    console.error(error, "Error fetching work locations");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


