'use client';

import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {revalidateProduct} from "../../actions/revalidateStudentData";
import {string} from "prop-types";
const StudentForm = ({
                         availableSlots,
                         handleFormSubmit,
                         formData,
                         btnText,
                         setFormData,
                         btnStyle,
                     }: any) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const { id } = useParams();

    const handleSubmit = async ()  => {
        await handleFormSubmit();
        dialogRef.current?.close();
        if (id) {
            await revalidateProduct(id);
        }
    };

    return (
        <>
            <button
                className="mt-4 px-6 py-2 w-full bg-[#3b3d93] text-white font-semibold rounded-lg shadow-md transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={availableSlots === 0}
                onClick={() => dialogRef.current?.showModal()}
            >
                Записатися
            </button>

            <dialog ref={dialogRef} className="backdrop:bg-black/50 p-0 border-none">
                <div className="p-6 bg-white rounded-lg shadow-lg w-96 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <h2 className="text-lg font-bold mb-4 text-center">Форма запису</h2>

                    <form action={handleSubmit} className="mt-4">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                ПІБ
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="group" className="block text-sm font-medium text-gray-700">
                                Група
                            </label>
                            <input
                                type="text"
                                id="group"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.group}
                                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className={btnStyle}>
                            {btnText}
                        </button>
                    </form>
                </div>
            </dialog>
        </>
    );
};

export default StudentForm;
