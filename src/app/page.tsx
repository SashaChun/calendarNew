import TeacherList from "@/components/TeacherList";
import {getTeachersAction} from "../../actions/getUsersActions";

export default async function Home() {
    const teachers = await getTeachersAction();
    return (
        <div>
            <TeacherList teachers={teachers} />
        </div>
    );
}
