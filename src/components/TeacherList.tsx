import Teacher from "@/components/teacher";

interface Teacher {
    id: string;
    fullName: string;
    photo: string;
    students: { id: string; name: string }[]; // Масив студентів
}

interface TeacherListProps {
    teachers: Teacher[];
}


const TeacherList: React.FC<TeacherListProps> = ({ teachers }) => {
    const maxStudents = 4;

    return (
        <div className="mt-10 grid grid-cols-2 gap-5">
            {teachers.map((teacher) => {
                const availableSlots = maxStudents - teacher.students.length;

                return (
                    <Teacher
                        key={teacher.id}
                        pib={teacher.fullName}
                        photo={teacher.photo}
                        availableSlots={availableSlots}
                        link={teacher.id}
                    />
                );
            })}
        </div>
    );
};

export default TeacherList;
