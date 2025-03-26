import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prismaDB';

interface Params {
  id: string;
}

export async function GET(request: Request, context: { params: Promise<Params> }) {
  const { id } = await context.params;

  if (!id || id.length === 0) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { students: true },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}