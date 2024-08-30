import React, { useEffect, useState } from 'react'
import TeacherSidebar from './Sidebar'
import { Content } from '../../styles/StudentsStyles'
import axios from 'axios';

const TeacherSubject = () => {
    const [isOpen, setIsOpen] = useState(true);

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_DEV_BASE_URL;

    const [subject, setSubject] = useState([])
    useEffect(() => {
        axios.get(`${API_URL}/auth/subject`)
        .then(result => {
            if(result.data.Status) {
                setSubject(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    return (
        <div className='flex font-poppins md:flex-col md:pl-0'>
            <TeacherSidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Subjects</h2>
                    <ul className="list-none p-0">
                        {subject.map(subject => (
                            <li key={subject.id} className='mb-4 flex justify-between items-center border-b py-2'>
                                <span className='text-sm'>{subject.subjectName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Content>
        </div>
    )
}

export default TeacherSubject