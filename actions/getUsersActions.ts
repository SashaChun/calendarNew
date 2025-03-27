'use server'

import prisma from '../src/lib/prismaDB';

export async function getTeachersAction() {
    try {

        const teachers = await prisma.teacher.findMany({
            include: {
                students: true,
            },
        });

        return teachers;
    } catch (error) {
        console.error('Error fetching teachers:', error);
        throw new Error('Unable to fetch teachers');
    }
}