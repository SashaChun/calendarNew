// app/api/teachers/route.js
import prisma from '../../../lib/prismaDB';  // Імпорт Prisma Client


export async function GET() {
    try {
        const teachers = await prisma.teacher.findMany({
            include: {
                students: true,  // Включаємо студентів, пов'язаних із кожним викладачем
            },
        });

        return new Response(JSON.stringify(teachers), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch teachers' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
