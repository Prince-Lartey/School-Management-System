import React, { useEffect, useState } from 'react'
import TeacherSidebar from './Sidebar'
import { Content } from '../../styles/SettingsProfileStyles'
import axios from 'axios';

const TeacherProfile = () => {
    const [isOpen, setIsOpen] = useState(true);

    const [teacher, setTeacher] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:4000/teacher/detail`)
        .then(result => {
            if (result.data.auth) {
                setTeacher(result.data.teacher);
            } else {
                console.log(result.data.message);
            }
        })
        .catch(error => console.log(error))
    }, [])


    return (
        <div className='flex font-poppins md:pl-0 md:flex-col'>
            <TeacherSidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Profile Details</h1>
                    <div className=''>
                        <div className='mb-5'>
                            <span className='font-bold'>Name: </span>
                            <span className='mb-2.5'>{teacher.name}</span>
                        </div>

                        <div className='mb-5'>
                            <span className='font-bold'>Email: </span>
                            <span className='mb-2.5'>{teacher.email}</span>
                        </div>

                        <div className='mb-5'>
                            <span className='font-bold'>Phone: </span>
                            <span className='mb-2.5'>{teacher.phone}</span>
                        </div>

                        <div className='mb-5'>
                            <span className='font-bold'>Address: </span>
                            <span className='mb-2.5'>{teacher.address}</span>
                        </div>

                        <div className='mb-5'>
                            <span className='font-bold'>Qualification: </span>
                            <span className='mb-2.5'>{teacher.qualification}</span>
                        </div>

                        <div className='mb-5'>
                            <span className='font-bold'>Subjects: </span>
                            <span className='mb-2.5'>{teacher.subjects}</span>
                        </div>
                    </div>
                </div>
            </Content>
        </div>
    )
}

export default TeacherProfile
