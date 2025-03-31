'use client'

import Image from "next/image";
import MyCalendar from "@/components/calendar";
import { useState, useEffect } from "react";

export interface Student {
    fullName: string;
    group: string;
    contentType: 'privet' | 'public'; // Додаємо contentType
}

export interface Teacher {
    id: string;
    fullName: string;
    photo: string;
    students: Student[];
    faculty: string;
    department: string;
    startHour: number;
    endHour: number;
}

interface TeacherProfileProps {
    teacher: Teacher;
    availableSlots: number;  // Додаємо availableSlots в тип
}

const TeacherProfile = ({ teacher }: { teacher: Teacher }) => {
    const [hasMoreThanThreeStudents, setHasMoreThanThreeStudents] = useState(false);

    const privatStydent = teacher.students.filter(student => student.contentType === 'privet');
    const publicStydent = teacher.students.filter(student => student.contentType === 'public');

    const availableSlots = 4 - privatStydent.length;
    // Обчислюємо, чи є більше ніж 3 студенти лише один раз
    useEffect(() => {
        if (privatStydent.length >= 4) {
            setHasMoreThanThreeStudents(true);
        } else {
            setHasMoreThanThreeStudents(false);
        }
    }, [privatStydent]); // Викликаємо тільки коли кількість студентів змінюється




    return (
        <div className="mt-5 flex flex-col items-center">
            <div className="flex py-10 flex-col md:flex-row w-full p-5 bg-white rounded-lg shadow-lg space-y-5 md:space-y-0 md:space-x-10">
                <div className="flex justify-center items-center bg-gray-100 rounded-full overflow-hidden w-[150px] h-[130px] shadow-lg">
                    {teacher.photo ? (
                        <Image src={teacher.photo} alt="Teacher photo" width={200} height={200} className="object-cover" priority />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                            No Photo
                        </div>
                    )}
                </div>
                <div className="flex space-x-5 flex-row w-[100%] justify-between">
                    <div className="flex flex-col text-center md:text-left space-y-3">
                        <p className="text-2xl font-bold text-gray-800">{teacher.fullName}</p>
                        <p className="text-lg text-gray-600">{teacher.faculty}</p>
                        <p className="text-lg text-gray-600">{teacher.department}</p>
                        <div className={'flex flex-row space-x-2 items-center'}>
                            <p className={`mt-2 text-lg font-semibold ${availableSlots > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {availableSlots > 0 ? `Вільні місця: ${availableSlots}` : "Немає вільних місць"}
                            </p>
                        </div>
                        <div className={'grid grid-cols-2 space-y-4'}>
                            {teacher.students.length > 0 ? (
                                privatStydent.map((student, index) => (
                                    <div
                                        key={index}
                                        className={'flex px-6 py-2 w-max bg-[#3b3d93] text-white font-semibold rounded-lg shadow-md text-xl font-bold text-gray-800 transition disabled:bg-gray-500 disabled:cursor-not-allowed'}>
                                        <p>{student.fullName}</p> <p className={'ml-5'}>{student.group}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Немає студентів.</p>
                            )}
                        </div>
                        <p className="text-xl font-bold text-gray-800">Записи на групову консультацію </p>
                        <div
                            className={'flex px-6 py-2 w-max bg-green-500 text-white font-semibold rounded-lg shadow-md text-xl font-bold text-gray-800 transition disabled:bg-gray-500 disabled:cursor-not-allowed'}>
                            додоно студентів {publicStydent.length}
                        </div>
                    </div>

                    <div>
                        <MyCalendar data={hasMoreThanThreeStudents} startHour={teacher.startHour}
                                    endHour={teacher.endHour}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
