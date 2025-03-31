'use client';

import { FC, useState } from 'react';
import { Calendar, momentLocalizer, View, SlotPropGetter, DayPropGetter } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import StydenForm from '@/components/stydenForm';
import { useParams } from 'next/navigation';
import { createStydentAction } from "../../actions/createStydentAction";
import {string} from "prop-types";

// Налаштовуємо moment на 24-годинний формат
moment.updateLocale('en', {
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY-MM-DD',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY LT',
        LLLL: 'dddd, MMMM D, YYYY LT'
    },
});

const localizer = momentLocalizer(moment);

interface Params {
    id: string;
}

interface MyCalendarProps {
    startHour: number;
    endHour: number;
    data: boolean;
}

interface FormData {
    name: string;
    group: string;
}

interface Event {
    start: Date;
    end: Date;
    title: string;
}

const MyCalendar: FC<MyCalendarProps> = ({  startHour , endHour , data }) => {


    const [currentView, setCurrentView] = useState<View>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const [formData, setFormData] = useState<FormData>({ name: '', group: '' });
    const [contentType , setContentType] = useState<string>('');

    const params = useParams() as unknown as Params;
    const { id } = params;

    const btnStyle = { btnText: 'Записатися', btnStyle: 'bg-[#3b3d93] text-white py-2 px-4 rounded-md' };

    const events: Event[] = []; // Define your events with correct types

    const handleViewChange = (view: View) => {
        setCurrentView(view);
    };

    const roundToQuarter = (date: Date) => {
        const minutes = date.getMinutes();
        const roundedMinutes = Math.round(minutes / 15) * 15;
        date.setMinutes(roundedMinutes);
        return date;
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        if (selectedStartDate) {
            const formattedStartDate = moment(selectedStartDate).format('YYYY-MM-DD HH:mm'); // Format date
            const studentData = {
                fullName: formData.name,
                group: formData.group,
                date: formattedStartDate,
                teacherId: id,
                contentType : contentType,
            };
            console.log(studentData)
              await createStydentAction(studentData);
        }
    };

    const isSlotAvailable = (date: Date) => {
        const meetingHour = 14; // Час для зустрічі (14:00)
        const hour = date.getHours(); // Отримуємо годину з дати

        // Перевіряємо, чи час знаходиться в межах доступних годин
        const isWithinAvailableTime = hour >= startHour && hour < endHour;

        // Час 14:00 має бути доступним
        const isAvailableAt14 = hour === meetingHour;

        // Повертаємо об'єкт з результатами
        return { isAvailableAt14, isWithinAvailableTime };
    };


    // const isSlotAvailable = (date: Date) => {
    //     const meetingHour = 14; // Час для зустрічі (14:00)
    //     const hour = date.getHours(); // Отримуємо годину з дати
    //
    //     // Перевіряємо, чи час знаходиться в межах доступних годин
    //     const isWithinAvailableTime = hour >= startHour && hour < endHour;
    //
    //     // Час 14:00 має бути доступним
    //     const isAvailableAt14 = hour === meetingHour;
    //
    //     // Слот доступний, якщо він в межах доступного часу або це 14:00
    //     return isWithinAvailableTime || isAvailableAt14;
    // };

    const slotPropGetter: SlotPropGetter = (date: Date) => {
        const available = isSlotAvailable(date);
        const meetingHour = 14;

        const slotHour = date.getHours();
        const slotMinutes = date.getMinutes();

        return {
            style: {
                // Якщо це година 13:00, фон буде червоним
                backgroundColor:
                    (slotHour === meetingHour && slotMinutes === 0) ? 'green' : // Якщо це початок години 13:00, то червоний
                        (available.isWithinAvailableTime && slotMinutes % 15 === 0) ? '#3b3d93' : 'lightgrey', // Якщо слот доступний і крок 15 хвилин, синій
                pointerEvents: available.isWithinAvailableTime ? 'auto' : 'none' as 'auto' | 'none', // Дозволяємо вибір тільки для доступних слотів
            },
        };
    };


    const dayPropGetter: DayPropGetter = (date: Date) => {
        const isThursday = date.getDay() === 4; // Перевіряємо, чи четвер

        return {
            style: {
                backgroundColor: isThursday ? '#3b3d93' : 'lightgrey',
                color: isThursday ? 'white' : 'grey',
            },
        };
    };

    const handleSelectSlot = (slotInfo: any) => {

        const slotHour = slotInfo.start.getHours();
        const slotMinutes = slotInfo.start.getMinutes();

        const isThursday = slotInfo.start.getDay() === 4;
        if (isThursday) {
            setCurrentView('day');
        }

        if (currentView === 'day') {
            const roundedStart = new Date(slotInfo.start);
            roundedStart.setMinutes(Math.round(roundedStart.getMinutes() / 15) * 15);


            const res = isSlotAvailable(slotInfo.start);

            const endDate = new Date(roundedStart);
            endDate.setMinutes(endDate.getMinutes() + 15);

            const meetingHour = 14;

            if (res.isAvailableAt14) {
                setContentType('public')
            } else if (res.isWithinAvailableTime) {
                setContentType('privet');
            }else if(!res.isAvailableAt14 || !res.isWithinAvailableTime){
                return 'no';
            }

            setSelectedStartDate(roundedStart);
            setSelectedEndDate(endDate);

            console.log(contentType)
            console.log(selectedStartDate)
        }
    };


    return (
        <div style={{ height: 500 }}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-3">
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'month').toDate())}
                    >
                        Назад
                    </button>
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => setCurrentDate(new Date())}
                    >
                        Сьогодні
                    </button>
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => setCurrentDate(moment(currentDate).add(1, 'month').toDate())}
                    >
                        Наступний
                    </button>
                </div>

                <div className="flex space-x-3">
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => handleViewChange('month')}
                    >
                        Місяць
                    </button>
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => handleViewChange('week')}
                    >
                        Тиждень
                    </button>
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => handleViewChange('day')}
                    >
                        День
                    </button>
                </div>
            </div>

            <div className="mt-3">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week', 'day']}
                    view={currentView}
                    date={currentDate}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onNavigate={(date) => setCurrentDate(date)}
                    style={{ width: 500, height: 300 }}
                    step={15}
                    timeslots={1}
                    components={{
                        toolbar: () => null,
                    }}
                    slotPropGetter={slotPropGetter}
                    dayPropGetter={dayPropGetter} // Додаємо стилізацію для четверга
                />
            </div>

            {selectedStartDate && selectedEndDate && (
                <p className="mt-4 text-center">
                    Початкова дата: <b>{moment(selectedStartDate).format('YYYY-MM-DD HH:mm')}</b><br />
                    Кінцева дата: <b>{moment(selectedEndDate).format('YYYY-MM-DD HH:mm')}</b>
                </p>
            )}
            {
                data ?
                    <div className="bg-red-500 text-white py-3 px-6 rounded-lg text-center font-bold shadow-md mt-5">
                        <span>Переведено</span>
                    </div> :
                    <StydenForm
                        btnText={btnStyle.btnText}
                        btnStyle={btnStyle.btnStyle}
                        availableSlots={1}
                        handleFormSubmit={handleFormSubmit}
                        formData={formData}
                        setFormData={setFormData}
                    />
            }
        </div>
    );
};

export default MyCalendar;
