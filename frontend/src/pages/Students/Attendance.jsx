import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { Content } from '../../styles/AttendanceStyles';
import moment from 'moment';

const AttendanceSummary = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [attendanceTotals, setAttendanceTotals] = useState({ totalPresent: 0, totalAbsent: 0, totalRecords: 0 })

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;
    
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const token = document.cookie.match(new RegExp('(^| )token=([^;]+)'))?.[2];
                if (!token) {
                    setError('No token provided.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${API_URL}/student/attendance_summary`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true // Ensure cookies are sent with the request
                });
                if (response.data.Status) {
                    setAttendanceRecords(response.data.Result);
                    setAttendanceTotals(response.data.Totals)
                } else {
                    setError(response.data.Error || 'No records found.');
                    setAttendanceRecords([]);
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while fetching the records.');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    // Function to format date as "day, month, year"
    const formatDate = (dateString) => {
        return moment(dateString).format('D MMMM YYYY')
    };

    return (
        <div className='flex font-poppins md:flex-col md:pl-0'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Attendance Summary</h1>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {error && <p className='text-red-500'>{error}</p>}
                            <div>
                                {attendanceRecords.length > 0 ? (
                                    <>
                                        <ul>
                                            {attendanceRecords.map((record, index) => (
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
                                ) : (
                                    <p className='text-red-500'>No attendance records found.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Content>
        </div>
    );
};

export default AttendanceSummary;
