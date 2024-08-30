import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {BsGraphUp, BsFileText, BsBook, BsGraphDown, BsGear, BsChatDots} from 'react-icons/bs'
import {  ToggleIcon } from '../../styles/SidebarStyles'
import schoolhubLogo4 from "../../assets/schoolhubLogo4.png"
import axios from 'axios'
import { FaChartBar, FaChartLine, FaSignOutAlt } from 'react-icons/fa'

const Sidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate()

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_DEV_BASE_URL;
    
    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    axios.defaults.withCredentials = true
    const handleLogout = () => {
        axios.get(`${API_URL}/student/logout`)
        .then(result => {
            if (result.data.Status) {
                localStorage.clear();
                sessionStorage.clear();

                // Redirect to login page
                navigate('/choose-user');

                // Replace the current entry in the history stack
                navigate('/choose-user', { replace: true });
            }
        })
    }


    return (
        <div className="fixed top-0 left-0 w-[250px] h-full bg-[#2c3e50] text-white overflow-y-auto pt-[60px] transition-all duration-300 ease-in-out z-[100]" style = {{width: isOpen ? '280px' : '65px'}} >
            <div className='p-5 text-2xl font-bold text-center'>
                <img src={schoolhubLogo4} alt="logo" className='w-12 h-auto' />
            </div>
            <ul className='list-none p-0'>
                <Link to='/student/dashboard' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsGraphUp /></div>
                    <p className="no-underline text-white ml-4">Dashboard</p>
                </Link>

                <Link to='/student/assignment' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsFileText /></div>
                    <p  className="no-underline text-white ml-4">Assignments</p>
                </Link>

                <Link to='/student/exams/results' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><FaChartBar /></div>
                    <p  className="no-underline text-white ml-4">Exam Results</p>
                </Link>

                <Link to='/student/performance' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsGraphDown /></div>
                    <p  className="no-underline text-white ml-4">Performances</p>
                </Link>

                <Link to='/student/attendance/summary' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><FaChartLine  /></div>
                    <p className="no-underline text-white ml-4">Attendance Summary</p>
                </Link>

                <Link to='/student/library' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsBook /></div>
                    <p  className="no-underline text-white ml-4">Library</p>
                </Link>

                <Link to='/student/announcements' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsChatDots /></div>
                    <p className="no-underline text-white ml-4">Announcements</p>
                </Link>

                <Link to='/student/profile' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsGear /></div>
                    <p className="no-underline text-white ml-4">Profile</p>
                </Link>

                <Link to='/' className='flex items-center py-3 px-5 mt-10 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl' onClick={handleLogout}>
                    <div className='mr-4'><FaSignOutAlt /></div>
                    <p className="no-underline text-white ml-4">Logout</p>
                </Link>

                <div onClick={toggleSidebar} className='absolute top-5 right-0 w-8 h-8 bg-[#34495e] rounded-full cursor-pointer flex items-center justify-center'>
                    <ToggleIcon isOpen={isOpen}>▲</ToggleIcon>
                </div>
            </ul>
        </div>
    )
}

export default Sidebar

