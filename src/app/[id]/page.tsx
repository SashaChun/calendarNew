import TeacherProfile from "@/components/TeacherProfile";
import { getTeacherByIdActions } from "../../../actions/getTeacherByIdActions";


interface TeacherPageProps {
    params: Promise<{ id: string }>;
}

const TeacherPage = async ({ params }: TeacherPageProps) => {
    const { id } = await params; // Очікуємо виконання промісу params

    const teacher = await getTeacherByIdActions(id);

    if (!teacher) {
        return <div>Teacher not found</div>;
    }

    return <TeacherProfile teacher={teacher} />;
};

export default TeacherPage;
