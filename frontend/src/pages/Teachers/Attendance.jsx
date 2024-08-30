import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TeacherSidebar from './Sidebar'
import { Content } from '../../styles/AttendanceStyles'

const TeacherAttendance = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isAttendanceTaken, setIsAttendanceTaken] = useState(false);

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

    useEffect(() => {
        // Fetch students based on grade_id
        axios.get(`${API_URL}/auth/student`, { params: { grade_id: 1 } })
            .then(result => {
                if (result.data.Status) {
                    setStudents(result.data.Result);

                    const initialAttendance = result.data.Result.map(student => ({
                        registrationNumber: student.registrationNumber,
                        status: 'Absent' // Default status
                    }));
                    setAttendance(initialAttendance);
                } else {
                    console.log(result.data.Error);
                }
            })
            .catch(error => console.log(error));

            // Check if attendance is already taken for the selected date
            axios.get(`${API_URL}/auth/check_attendance`, { params: { date } })
                .then(result => {
                    if (result.data.Status && result.data.AttendanceTaken) {
                        setIsAttendanceTaken(true);
                    }
                })
                .catch(error => console.log(error));
    }, [date]);

    const handleStatusChange = (registrationNumber, status) => {
        setAttendance(attendance.map(a => a.registrationNumber === registrationNumber ? { ...a, status } : a));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (attendance.length === 0) {
            toast.error('No attendance records provided.', { autoClose: 5000 });
            console.log('No attendance records provided.');
            return;
        }

        axios.post(`${API_URL}/auth/add_attendance`, { date, attendance })
            .then(result => {
                if (result.data.Status) {
                    toast.success('Attendance submitted successfully!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setIsAttendanceTaken(true); // Disable the form after submission
                    console.log('Attendance saved successfully');
                } else {
                    toast.error('Failed to save attendance', { autoClose: 5000 });
                    console.log(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    };

    // Function to format date as "day, month, year"
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <div className='flex font-poppins md:pl-0 md:flex-col'>
            <TeacherSidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Attendance for {formatDate(date)}</h2>
                    <form className='mb-10'>
                        {students.map(student => (
                            <div key={student.registrationNumber} className='flex mb-3'>
                                <span className='flex-1'>{student.name}</span>
                                <label className='mr-5'>
                                    <input type="radio" name={`attendance-${student.registrationNumber}`} onChange={() => handleStatusChange(student.registrationNumber, 'present')} disabled={isAttendanceTaken}/> Present
                                </label>
                                <label>
                                    <input type="radio" name={`attendance-${student.registrationNumber}`} onChange={() => handleStatusChange(student.registrationNumber, 'absent')} disabled={isAttendanceTaken}/> Absent
                                </label>
                            </div>
                        ))}
                        <button className='px-4 py-2 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-700 transition-colors duration-300' onClick={handleSubmit} disabled={isAttendanceTaken}>Submit</button>
                    </form>
                </div>
            </Content>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default TeacherAttendance