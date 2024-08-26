import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/AnnouncementStyles'
import axios from 'axios'

const StudentAnnouncement = () => {
    const [isOpen, setIsOpen] = useState(true)

    const [announcement, setAnnouncement] = useState([])
    useEffect(() => {
        axios.get('http://localhost:4000/auth/announcement')
        .then(result => {
            if(result.data.Status) {
                setAnnouncement(result.data.Result)
            } else {
                alert(result.data.Error) 
            }
        })
        .catch(error => console.log(error))
    }, [])
    
    return (
        <div className='flex font-poppins md:flex-col md:pl-0'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Announcements</h1>
                    <ul className='list-none p-0'>
                        {announcement.map(announcement => (
                            <li key={announcement.id} className='mb-4 flex justify-between items-center border-b py-2'>
                                <span className='text-sm mr-2'>{announcement.message}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Content>
        </div>
    )
}

export default StudentAnnouncement
