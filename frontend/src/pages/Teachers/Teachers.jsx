import React, { useEffect, useState } from 'react'
import TeacherSidebar from './Sidebar'
import { Content } from '../../styles/TeachersStyles'
import axios from 'axios';

const TeacherTeachers = () => {
    const [isOpen, setIsOpen] = useState(true);

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

    // Get subject details
    const [subjects, setSubjects] = useState([]);
    useEffect(() => {
        axios.get(`${API_URL}/auth/subject`)
            .then(result => {
                if (result.data.Status) {
                    setSubjects(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    }, []);

    // Get teacher details
    const [teachers, setTeachers] = useState([]);
    useEffect(() => {
        axios.get(`${API_URL}/auth/teachers`)
            .then(result => {
                if (result.data.Status) {
                    console.log(result.data.Result)
                    setTeachers(result.data.Result);
                } else {
                    console.log(result.data.Error)
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    }, []);

    // View teacher details
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const handleViewDetails = (teacher) => {
        setSelectedTeacher(teacher);
    };

    return (
        <div className='flex font-poppins md:flex-col md:pl-0'>
            <TeacherSidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Teachers</h2>
                    <table className='w-full border-gray-300'>
                        <thead className='bg-gray-200 text-left'>
                            <tr>
                                <th className='py-2 px-4 border-b '>Name</th>
                                <th className='py-2 px-4 border-b '>Email</th>
                                <th className='py-2 px-4 border-b '>Subjects taught</th>
                                <th className='py-2 px-4 border-b '>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-left'>
                            {teachers.map(teacher => (
                                <tr key={teacher.id}>
                                    <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{teacher.name}</td>
                                    <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{teacher.email}</td>
                                    <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{teacher.subjects}</td>
                                    <td className='py-2 px-4 border-b'>
                                        <button className='p-1 bg-blue-500 hover:bg-blue-700 cursor-pointer rounded text-xs text-white font-semibold transition-colors duration-300' onClick={() => handleViewDetails(teacher)}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Content>

            {selectedTeacher && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-md w-1/3">
                        <h2 className="text-xl font-bold mb-4">Teacher Details</h2>
                        <p className='mb-2'><strong>Name:</strong> {selectedTeacher.name}</p>
                        <p className='mb-2'><strong>Email:</strong> {selectedTeacher.email}</p>
                        <p className='mb-2'><strong>Phone:</strong> {selectedTeacher.phone}</p>
                        <p className='mb-2'><strong>Address:</strong> {selectedTeacher.address}</p>
                        <p className='mb-2'><strong>Qualification:</strong> {selectedTeacher.qualification}</p>
                        <p><strong>Subjects:</strong> {selectedTeacher.subjects}</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-red-400 px-4 py-2 rounded hover:bg-red-500 transition-colors duration-300" onClick={() => setSelectedTeacher(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherTeachers
