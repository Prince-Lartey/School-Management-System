import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {BsGraphUp, BsPeople, BsPerson, BsFileText, BsBook, BsGraphDown, BsCalendar, BsGear, BsCalendarEvent, BsChatDots} from 'react-icons/bs'
import { FaChevronDown, FaChevronUp, FaPlusCircle, FaChartBar, FaBookOpen, FaLayerGroup, FaSignOutAlt, FaClipboardList, FaChartLine   } from 'react-icons/fa';
import {  ToggleIcon } from '../../styles/SidebarStyles'
import schoolhubLogo4 from "../../assets/schoolhubLogo4.png"
import axios from 'axios';
import { MdOutlineAssignment } from 'react-icons/md'

const Sidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate()
    
    const [isExamsOpen, setIsExamsOpen] = useState(false);
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;


    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const toggleExams = () => {
        setIsExamsOpen(!isExamsOpen);
    };

    const toggleAttendance = () => {
        setIsAttendanceOpen(!isAttendanceOpen);
    };

    axios.defaults.withCredentials = true
    const handleLogout = () => {
        axios.get(`${API_URL}/auth/logout`)
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
            <ul className='list-none p-0 '>
                <Link to='/admin/dashboard' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsGraphUp /></div>
                    <p  className="no-underline text-white ml-4">Dashboard</p>
                </Link>

                <Link to='/admin/grades' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><FaLayerGroup /></div>
                    <p  className="no-underline text-white ml-4">Grades</p>
                </Link>

                <Link to='/admin/subjects' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><FaBookOpen /></div>
                    <p  className="no-underline text-white ml-4">Subjects</p>
                </Link>

                <Link to='/admin/students' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsPeople /></div>
                    <p  className="no-underline text-white ml-4">Students</p>
                </Link>

                <Link to='/admin/teachers' className='flex items-center py-3 px-5 text-base hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsPerson /></div>
                    <p  className="no-underline text-white ml-4">Teachers</p>
                </Link>

                <Link to='/admin/assignment' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsFileText /></div>
                    <p  className="no-underline text-white ml-4">Assignments</p>
                </Link>

                <Link to='' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl' onClick={toggleExams}>
                    <div className='mr-4'><BsBook /></div>
                    <span className="ml-4">Exams</span>
                    <div className='ml-auto cursor-pointer'>{isExamsOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
                </Link>

                {isExamsOpen && (
                    <ul className='list-none px-5'>
                        <Link to='/admin/exams/create' className='flex items-center py-2 px-8 text-sm  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                            <div className='mr-4'><FaPlusCircle /></div>
                            <p className="no-underline text-white">Create Exams</p>
                        </Link>
                        <Link to='/admin/exams/results' className='flex items-center py-2 px-8 text-sm  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                            <div className='mr-4'><FaChartBar /></div>
                            <p  className="no-underline text-white">Exam Results</p>
                        </Link>
                        <Link to='/admin/exams/reports' className='flex items-center py-2 px-8 text-sm  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                            <div className='mr-4'><MdOutlineAssignment /></div>
                            <p  className="no-underline text-white">Exam Reports</p>
                        </Link>
                    </ul>
                )}

                <Link to='/admin/performance' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsGraphDown /></div>
                    <p  className="no-underline text-white ml-4">Performances</p>
                </Link>

                <Link to='' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl' onClick={toggleAttendance}>
                    <div className='mr-4'><BsCalendar /></div>
                    <span className="ml-4">Attendance</span>
                    <div className='ml-auto cursor-pointer'>{isAttendanceOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
                </Link>

                {isAttendanceOpen && (
                    <ul className='list-none px-5'>
                        <Link to='/admin/attendance/add' className='flex items-center py-2 px-8 text-sm  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                            <div className='mr-4'><FaClipboardList /></div>
                            <p  className="no-underline text-white">Take Attendance</p>
                        </Link>
                        <Link to='/admin/attendance/summary' className='flex items-center py-2 px-8 text-sm  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                            <div className='mr-4'><FaChartLine  /></div>
                            <p className="no-underline text-white">Attendance Summary</p>
                        </Link>
                    </ul>
                )}

                <Link to='/admin/library' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsBook /></div>
                    <p className="no-underline text-white ml-4">Library</p>
                </Link>

                <Link to='/admin/announcements' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsChatDots /></div>
                    <p className="no-underline text-white ml-4">Announcements</p>
                </Link>

                <Link to='/admin/eventCalendar' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsCalendarEvent /></div>
                    <p className="no-underline text-white ml-4">Event and Calendar</p>
                </Link>

                {/* <Link to='/admin/settingsprofile' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white hover:rounded-r-3xl'>
                    <div className='mr-4'><BsGear /></div>
                    <p className="no-underline text-white ml-4">Settings and Profiles</p>
                </Link> */}

                <Link to='/' className='flex items-center py-3 px-5 text-base  hover:bg-gray-500 hover:text-white mt-10 mb-5 hover:rounded-r-3xl'  onClick={handleLogout}>
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
