import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from './Sidebar'
import { Content } from '../../styles/AttendanceStyles'
import moment from 'moment'

const TeacherAttendanceSummary = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState('');
    const [attendanceRecordsByStudent, setAttendanceRecordsByStudent] = useState([]);
    const [attendanceRecordsByDate, setAttendanceRecordsByDate] = useState([]);

    useEffect(() => {
        // Fetch the list of students
        axios.get('http://localhost:4000/auth/student')
            .then(result => {
                if (result.data.Status) {
                    setStudents(result.data.Result);
                } else {
                    console.log(result.data.Error);
                }
            })
            .catch(error => console.log(error));

        // Fetch the list of recorded dates
        axios.get('http://localhost:4000/auth/recorded_dates')
            .then(result => {
                if (result.data.Status) {
                    setDates(result.data.Result);
                } else {
                    console.log(result.data.Error);
                }
            })
            .catch(error => console.log(error));

    }, []);

    const handleStudentChange = (event) => {
        const studentId = event.target.value;
        setSelectedStudent(studentId);

        if (studentId) {
            // Fetch attendance summary for the selected student
            axios.get('http://localhost:4000/auth/attendance_summary', { params: { registrationNumber: studentId } })
                .then(result => {
                    if (result.data.Status) {
                        setAttendanceRecordsByStudent(result.data.Result);
                        setAttendanceTotals(result.data.Totals); // Set totals
                        setAttendanceRecordsByDate([]); // Clear date records
                        setError('');
                    } else {
                        setError(result.data.Error || 'No records found.');
                        setAttendanceRecordsByStudent([]);
                        setAttendanceTotals({ totalPresent: 0, totalAbsent: 0, totalRecords: 0 }); // Reset totals
                    }
                })
                .catch(error => {
                    console.error(error);
                    setError('An error occurred while fetching the records.');
                    setAttendanceRecordsByStudent([]);
                });
        } else {
            setAttendanceRecordsByStudent([]);
        }
    };

    const [attendanceTotals, setAttendanceTotals] = useState({ totalPresent: 0, totalAbsent: 0, totalRecords: 0 })

    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date);

        if (date) {
            // Fetch attendance summary for the selected date
            axios.get('http://localhost:4000/auth/attendance_details_by_date', { params: { date } })
                .then(result => {
                    if (result.data.Status) {
                        setAttendanceRecordsByDate(result.data.Result);
                        setAttendanceTotals(result.data.Totals); // Set totals from the backend response
                        setAttendanceRecordsByStudent([]); // Clear student records
                        setError('');
                    } else {
                        setError(result.data.Error || 'No records found.');
                        setAttendanceRecordsByDate([]);
                        setAttendanceTotals({ totalPresent: 0, totalAbsent: 0, totalStudents: 0 }); // Reset totals
                    }
                })
                .catch(error => {
                    console.error(error);
                    setError('An error occurred while fetching the records.');
                    setAttendanceRecordsByDate([]);
                });
        } else {
            setAttendanceRecordsByDate([]);
        }
    };

    // Function to format date as "day, month, year"
    const formatDate = (dateString) => {
        return moment(dateString).format('D MMMM YYYY')
    };

    return (
        <div className='flex font-poppins md:pl-0 md:flex-col'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Attendance Summary</h2>
                    <div className='mb-5'>
                        <select value={selectedStudent} onChange={handleStudentChange} className='p-2 border border-gray-300 rounded-md mr-5'>
                            <option value="">Select a student</option>
                            {students.map(student => (
                                <option key={student.registrationNumber} value={student.registrationNumber}>
                                    {student.name}
                                </option>
                            ))}
                        </select>

                        <select value={selectedDate} onChange={handleDateChange} className='p-2 border border-gray-300 rounded-md'>
                            <option value="">Select a date</option>
                            {dates.map(date => (
                                <option key={date.date} value={date.date}>
                                    {formatDate(date.date)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className='text-red-500'>{error}</p>}

                    <ul>
                        {selectedStudent && attendanceRecordsByStudent.length > 0 && (
                            <>
                                <ul>
                                    {attendanceRecordsByStudent.map((record, index) => (
                                        <li key={index} className='flex mb-3'>
                                            <span className='flex-1 text-sm'>{formatDate(record.date)}</span>
                                            <span className={`flex-1 text-sm ${record.status === 'present' ? 'text-green-500' : 'text-red-500'}`}>{record.status}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className='mt-5 flex gap-10'>
                                    <p> <strong>Total Days Present : </strong>{attendanceTotals.totalPresent}</p>
                                    <p> <strong>Total Days Absent : </strong>{attendanceTotals.totalAbsent}</p>
                                    <p> <strong>Total Days Records : </strong>{attendanceTotals.totalRecords}</p>
                                </div>
                            </>
                        )}

                        {selectedDate && attendanceRecordsByDate.length > 0 && (
                            <>
                                <ul>
                                    {attendanceRecordsByDate.map((record, index) => (
                                        <li key={index} className='flex mb-3'>
                                            <span className='flex-1 text-sm'>{record.name}</span>
                                            <span className={`flex-1 text-sm ${record.status === 'present' ? 'text-green-500' : 'text-red-500'}`}>{record.status}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className='mt-5 flex gap-10'>
                                    <p><strong>Total Students Present : </strong> {attendanceTotals.totalPresent}</p>
                                    <p><strong>Total Students Absent : </strong> {attendanceTotals.totalAbsent}</p>
                                    <p><strong>Total Students : </strong> {attendanceTotals.totalStudents}</p>
                                </div>
                            </>
                        )}


                    </ul>
                </div>
            </Content>
        </div>
    );
}

export default TeacherAttendanceSummary
