'use server'
import prisma from '../src/lib/prismaDB'

import { ObjectId } from 'mongodb';


export async function createStydentAction({ fullName, group, contentType ,date, teacherId }: { fullName: string, group: string, contentType : string, date: string, teacherId: string }) {
    try {
        // Перевірка обов'язкових полів
        if (!fullName || !group || !date || !teacherId) {
            throw new Error('Усі поля є обов’язковими.');
        }

        // Перевірка валідності teacherId
        if (!ObjectId.isValid(teacherId)) {
            throw new Error('Невірний teacherId.');
        }

        // Перевірка формату дати
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Невірний формат дати.');
        }
        // Додавання студента
        const newStudent = await prisma.student.create({
            data: {
                fullName,
                group,
                date: parsedDate,
                teacherId,
                contentType,
            },
        });

        return newStudent;
    } catch (error) {
        console.error('Помилка при додаванні студента:' );
        throw new Error('Не вдалося додати студента.');
    } finally {
        await prisma.$disconnect();
    }
}
