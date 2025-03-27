'use server'

import prisma from "@/lib/prismaDB";

interface Params {
    id: string;
}

export async function getTeacherByIdActions(id: string) {
    if (!id || id.length === 0) {
        throw new Error("Invalid ID format");
    }

    try {
        const teacher = await prisma.teacher.findUnique({
            where: { id },
            include: { students: true },
        });

        if (!teacher) {
            throw new Error("Teacher not found");
        }

        return teacher;
    } catch (error) {
        console.error("Error fetching teacher:", error);
        throw new Error("Internal Server Error");
    } finally {
        await prisma.$disconnect();
    }
}
