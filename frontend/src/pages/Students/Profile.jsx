import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/SettingsProfileStyles'
import axios from 'axios';

const StudentProfile = () => {
    const [isOpen, setIsOpen] = useState(true)

    const [student, setStudent] = useState([])

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

    useEffect(() => {
        axios.get(`${API_URL}/student/detail`)
        .then(result => {
            if (result.data.Status) {
                setStudent(result.data.Result);
            } else {
                console.log(result.data.Error);
            }
        })
        .catch(error => console.log(error))
    }, [])


    return (
        <div className='flex font-poppins md:flex-col md:pl-0'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Profile Details</h1>
                    <div className=''>
                        <div className='mb-5'>
                            <span className='font-bold'>Name: </span>
                            <span className='mb-2.5'>{student.name}</span>
                        </div>

                        <div className='mb-5'>
                            <span className='font-bold'>Registration Number: </span>
                            <span className='mb-2.5'>{student.registrationNumber}</span>
                        </div>

                        <div className='mb-5'>
                            <span className='font-bold'>Grade: </span>
                            <span className='mb-2.5'>{student.gradeName}</span>
                        </div>

                        <div className='mb-5'>
                            <span className='font-bold'>Email: </span>
                            <span className='mb-2.5'>{student.email}</span>
                        </div>

                        <div className='mb-5'>
                            <span className='font-bold'>Guardian Phone Number: </span>
                            <span className='mb-2.5'>{student.guardianPhone}</span>
                        </div>
                    </div>
                </div>
            </Content>
        </div>
    )
}

export default StudentProfile
