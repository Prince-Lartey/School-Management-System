import React, { useEffect, useState } from 'react'
import TeacherSidebar from './Sidebar'
import { Content } from '../../styles/StudentsStyles'
import axios from 'axios';

const TeacherStudents = () => {
    const [isOpen, setIsOpen] = useState(true);

    // Retrieve grade from database
    const [grades, setGrades] = useState([])

    useEffect(() => {
        axios.get('http://localhost:4000/auth/grade')
        .then(result => {
            if(result.data.Status) {
                setGrades(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    // Retrieve student details from database
    const [addStudent, setAddStudent] = useState([])

    useEffect(() => {
        axios.get('http://localhost:4000/auth/student')
        .then(result => {
            if(result.data.Status) {
                setAddStudent(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    // State for viewing student details
    const [viewModal, setViewModal] = useState(false);
    const [studentDetails, setStudentDetails] = useState({});

    const openViewModal = (registrationNumber) => {
        axios.get(`http://localhost:4000/auth/student/${registrationNumber}`)
        .then(result => {
            if (result.data.Status) {
            setStudentDetails(result.data.Result[0]);
            setViewModal(true);
            } else {
            alert(result.data.Error);
            }
        })
        .catch(error => console.log(error));
    }
    const closeViewModal = () => {
        setViewModal(false);
    }

    return (
        <div className='flex font-poppins md:flex-col md:pl-0'>
            <TeacherSidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>List of all Students</h2>
                    <table className='w-full border-gray-300'>
                        <thead className='bg-gray-200 text-left'>
                            <tr>
                                <th className='py-2 px-4 border-b '>Student Name</th>
                                <th className='py-2 px-4 border-b '>Registration Number</th>
                                <th className='py-2 px-4 border-b '>Grade</th>
                                <th className='py-2 px-4 border-b '>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-left'>
                            {
                                addStudent.map(addStudent => (
                                    <tr key={addStudent.registrationNumber}>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addStudent.name}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addStudent.registrationNumber}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addStudent.gradeName}</td>
                                        <td className='py-2 px-4 border-b'>
                                            <button className='p-1 bg-blue-500 hover:bg-blue-700 cursor-pointer rounded text-xs text-white font-semibold' onClick={() => openViewModal(addStudent.registrationNumber)}>View</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </Content>

            {viewModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-md w-1/3">
                        <h2 className="text-xl font-bold mb-4">Student Details</h2>
                        <p className='mb-2'><strong>Name:</strong> {studentDetails.name}</p>
                        <p className='mb-2'><strong>Registration Number:</strong> {studentDetails.registrationNumber}</p>
                        <p className='mb-2'><strong>Email:</strong> {studentDetails.email}</p>
                        <p className='mb-2'><strong>Grade:</strong> {studentDetails.gradeName}</p>
                        <p><strong>Guardian Phone:</strong> {studentDetails.guardianPhone}</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-red-400 px-4 py-2 rounded hover:bg-red-500" onClick={closeViewModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherStudents
