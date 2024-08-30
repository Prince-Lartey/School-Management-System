import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/AssignmentsStyles'
import axios from 'axios'
import moment from 'moment'

const StudentAssignment = () => {
    const [isOpen, setIsOpen] = useState(true)

    const [assignments, setAssignments] = useState([]);

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

    useEffect(() => {
        axios.get(`${API_URL}/student/assignments`, { withCredentials: true })
            .then(response => {
                console.log(response.data)
                if (response.data.Status) {
                    setAssignments(response.data.Result);
                } else {
                    console.log(response.data.Error);
                }
            })
            .catch(error => console.log(error));
    }, []);

    const formatDate = (dateString) => {
        return moment(dateString).format('DD-MM-YYYY')
    };

    return (
        <div className='flex font-poppins md:flex-col md:pl-0'> 
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Assignments</h1>
                    <table className='w-full border-gray-300'>
                        <thead className='bg-gray-200 text-left'>
                            <tr>
                                <th className='py-2 px-4 border-b '>Subject</th>
                                <th className='py-2 px-4 border-b '>Title</th>
                                <th className='py-2 px-4 border-b '>Description</th>
                                <th className='py-2 px-4 border-b '>Deadline</th>
                            </tr>
                        </thead>

                        <tbody>
                        {assignments.length > 0 ? (
                                assignments.map(assignment => (
                                    <tr key={assignment.id}>
                                        <td className='py-2 px-4 border-b'>{assignment.subjectName}</td>
                                        <td className='py-2 px-4 border-b'>{assignment.title}</td>
                                        <td className='py-2 px-4 border-b'>{assignment.description}</td>
                                        <td className='py-2 px-4 border-b'>{formatDate(assignment.deadline)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className='py-2 px-4 border-b text-red-500'>No assignments available for your grade.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Content>
        </div>
    )
}

export default StudentAssignment
