import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/DashboardStyles'
import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { BsCheckCircleFill, BsFileTextFill, BsGraphDownArrow, BsXCircleFill } from 'react-icons/bs'
import { FaLayerGroup } from 'react-icons/fa'
import { Bar, Line, Pie } from 'react-chartjs-2'

const StudentDashboard = () => {
    const [isOpen, setIsOpen] = useState(true)

    const [assignmentCount, setAssignmentCount] = useState(0);
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [studentCountsByGrade, setStudentCountsByGrade] = useState([]);
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const [gradePerformanceData, setGradePerformanceData] = useState([]);
    //const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [attendanceTotals, setAttendanceTotals] = useState({ totalPresent: 0, totalAbsent: 0, totalRecords: 0 })

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

    // Get events, announcements and total assignment count
    useEffect(() => {
        axios.get(`${API_URL}/student/assignmentsCount`, { withCredentials: true })
            .then(response => {
                if (response.data.Status) {
                    setAssignmentCount(response.data.Result);
                } else {
                    console.log(response.data.Error);
                }
            })
            .catch(error => console.log(error));

        axios.get(`${API_URL}/auth/events`)
            .then(result => {
                if (result.data.Status) setEvents(result.data.Result);
            })
            .catch(error => console.log(error));

        axios.get(`${API_URL}/auth/announcement`)
            .then(result => {
                if (result.data.Status) setAnnouncements(result.data.Result);
            })
            .catch(error => console.log(error));

        axios.get(`${API_URL}/auth/student_count_by_grade`)
            .then(result => {
                if (result.data.Status) setStudentCountsByGrade(result.data.Result);
            })
            .catch(error => console.log(error));

        // Fetch student performance data
        axios.get(`${API_URL}/auth/grade_performance`)
        .then(result => {
            if (result.data.Status) {
                const gradeData = result.data.GradePerformance;
                
                setGradePerformanceData(gradeData);
                
            } else {
                console.log(result.data.Error);
            }
        })
        .catch(error => console.log(error));

        // Fetch gender distribution data
        axios.get(`${API_URL}/auth/student_gender_distribution`)
            .then(result => {
                if (result.data.Status) {
                    setMaleCount(result.data.maleCount);
                    setFemaleCount(result.data.femaleCount);
                }
            })
            .catch(error => console.log(error));
    }, []);

    // Get attendance record of student.
    useEffect(() => {
        axios.get(`${API_URL}/student/attendance_summary`, {
            withCredentials: true // Ensure cookies are sent with the request
        })
        .then(response => {
            if (response.data.Status) {
                //console.log('Attendance Totals:', response.data.Totals);
                //setAttendanceRecords(response.data.Result);
                setAttendanceTotals(response.data.Totals);
            } else {
                setError(response.data.Error || 'No records found.');
                //setAttendanceRecords([]);
            }
        })
        .catch(err => {
            console.error(err);
            setError('An error occurred while fetching the records.');
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    // Get student total score
    const [examResults, setExamResults] = useState([])
    useEffect(() => {
        axios.get(`${API_URL}/student/student-exam-results`, { withCredentials: true })
            .then(response => {
                if (response.data.Status) {
                    setExamResults(response.data.Result);
                } else {
                    console.log(response.data.Error);
                }
            })
            .catch(error => console.log(error));
            
    }, []);
    const marks = examResults.map(result => result.marks);
    const totalMarks = marks.reduce((total, mark) => total + mark, 0);

    // Prepare data for the bar chart
    const studentCountChartData = {
        labels: studentCountsByGrade.map(data => data.gradeName),
        datasets: [
            {
                label: 'Number of Students',
                data: studentCountsByGrade.map(data => data.studentCount),
                backgroundColor: 'lightgray',
                hoverBackgroundColor: 'gray',
                borderWidth: 1,
            }
        ]
    };
    const barChartOptions = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return Number.isInteger(value) ? value : null; // Display only whole numbers
                    },
                    font: {
                        family: 'Poppins',
                        size: 10,
                    },
                },
            },
            x: {
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 10,
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Student Distribution by Grade',
                position: 'top',
                align: 'start',
                font: {
                    size: 14,
                    weight: 'bold',
                }
            },
        },
    };

    // Prepare data for the line chart
    const lineChartData = {
        labels: gradePerformanceData.map(grade => grade.gradeName),
        datasets: [
            {
                label: 'Average Grade Score',
                data: gradePerformanceData.map(grade => grade.gradeAvgScore),
                fill: false,
                borderColor: '#007bff',
                tension: 0.5
            }
        ]
    };

    const lineChartOptions = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false,
                max: 100,
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 10, // Small font size for labels
                    },
                },
            },
            x: {
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 10, // Small font size for labels
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Average Grade Performance',
                align: 'start',
                font: {
                    size: 14,
                    weight: 'bold',
                }
            },
        },
    };

    // Prepare data for pie chart
    const allStudents = maleCount + femaleCount;
    const malePercentage = allStudents ? ((maleCount / allStudents) * 100).toFixed(2) : 0;
    const femalePercentage = allStudents ? ((femaleCount / allStudents) * 100).toFixed(2) : 0;

    const pieData = {
        labels: ['Male', 'Female'],
        datasets: [
            {
                data: [malePercentage, femalePercentage],
                backgroundColor: ['#2c3e50', '#007bff'],
                hoverBackgroundColor: ['#1a252f', '#0056b3'],
            },
        ],
    };

    const pieOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    generateLabels: function (chart) {
                        const data = chart.data;
    
                        return data.labels.map((label, index) => {
                            const count = label === 'Male' ? maleCount : femaleCount;
                            return {
                                text: `${label} (${count} students)`, // Customize legend label
                                fillStyle: data.datasets[0].backgroundColor[index],
                                strokeStyle: data.datasets[0].backgroundColor[index],
                                hidden: false,
                                index: index
                            };
                        });
                    }
                },
            },
            title: {
                display: true,
                text: 'Student Distribution by Gender',
                position: 'top',
                align: 'start',
                font: {
                    size: 14,
                    weight: 'bold',
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        return `${label}: ${context.raw}%`;
                    },
                },
            },
        },
    };
        
    const formatDate = (dateString) => {
        return moment(dateString).format('DD-MM-YYYY')
    };

    return (
        <div className='flex font-poppins'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <div className='flex gap-5 flex-1'>
                        <section className='mb-5 flex-1'>
                            <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Dashboard Overview</h2>
                            <div className='flex gap-5'>
                                <Link to='/student/assignment' className='flex items-center bg-white p-5 rounded-lg shadow-md transition-transform duration-300 cursor-pointer flex-1 max-w-xs hover:transform hover:-translate-y-1'>
                                    <div className='mr-3 bg-gray-100 text-xl p-2 rounded text-[#2c3e50]'><BsFileTextFill /></div>
                                    <div>
                                        <p className='text-lg font-bold text-[#555555]'>{assignmentCount}</p>
                                        <h3 className='text-sm mb-2.5 text-gray-400 font-semibold'>AVAILABLE ASSIGNMENT/S</h3>
                                    </div>
                                </Link>

                                <Link to='/student/exams/results' className='flex items-center bg-white p-5 rounded-lg shadow-md transition-transform duration-300 cursor-pointer flex-1 max-w-xs hover:transform hover:-translate-y-1'>
                                    <div className='mr-3 bg-gray-100 text-xl p-2 rounded text-[#2c3e50]'><BsGraphDownArrow /></div>
                                    <div>
                                        <p className='text-lg font-bold text-[#555555]'>{totalMarks}</p>
                                        <h3 className='text-sm mb-2.5 text-gray-400 font-semibold'>OVERALL PERFORMANCE</h3>
                                    </div>
                                </Link>

                                <div className='flex items-center bg-white p-5 rounded-lg shadow-md transition-transform duration-300 cursor-pointer flex-1 max-w-xs hover:transform hover:-translate-y-1'>
                                    <div className='mr-3 bg-gray-100 text-xl p-2 rounded text-[#2c3e50]'><FaLayerGroup /></div>
                                    <div>
                                        <p className='text-lg font-bold text-[#555555]'>1st</p>
                                        <h3 className='text-sm mb-2.5 text-gray-400 font-semibold'>TERM</h3>
                                    </div>
                                </div>

                                <Link to='/student/attendance/summary' className='flex items-center bg-[#2c3e50] p-5 rounded-lg shadow-md transition-transform duration-300 cursor-pointer flex-1 max-w-xs hover:transform hover:-translate-y-1'>
                                    <div className='mr-3 bg-gray-100 text-xl p-2 rounded text-[#2c3e50]'><BsCheckCircleFill /></div>
                                    <div>
                                        <p className='text-lg font-bold text-white'>{attendanceTotals.totalPresent}</p>
                                        <h3 className='text-sm mb-2.5 text-gray-400 font-semibold'>TOTAL DAYS PRESENT</h3>
                                    </div>
                                </Link>

                                <Link to='/student/attendance/summary' className='flex items-center bg-white p-5 rounded-lg shadow-md transition-transform duration-300 cursor-pointer flex-1 max-w-xs hover:transform hover:-translate-y-1'>
                                    <div className='mr-3 bg-gray-100 text-xl p-2 rounded text-[#2c3e50]'><BsXCircleFill /></div>
                                    <div>
                                        <p className='text-lg font-bold text-[#555555]'>{attendanceTotals.totalAbsent}</p>
                                        <h3 className='text-sm mb-2.5 text-gray-400 font-semibold'>TOTAL DAYS ABSENT</h3>
                                    </div>
                                </Link>
                            </div>
                        </section>
                    </div>

                    <div className='mt-5 flex gap-5 flex-1'>
                        <section className='flex-1 rounded-lg shadow-lg p-2 border-2 relative h-[350px]'>
                            <Line data={lineChartData} options={lineChartOptions} />
                        </section>

                        <section className='flex-1 rounded-lg shadow-lg p-2 border-2 relative h-[350px]'>
                            <Bar data={studentCountChartData} options={barChartOptions} />                            
                        </section>
                    </div>

                    <div className='mt-10 flex gap-5'>
                        <section className='flex-1 rounded-lg shadow-lg p-2 border-2 relative h-[300px]'>
                            <Pie data={pieData} options={pieOptions} />
                        </section>

                        <section className=' flex-1 rounded-lg shadow-lg p-2 border-2'>
                                <h2 className='text-md mb-4 font-semibold text-[#333333]'>Upcoming Events</h2>
                                <ul className='list-none'>
                                    {events.map(event => (
                                        <li key={event.id} className='mb-3 relative pl-6'>
                                            <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full'></span>
                                            <h3 className='text-sm font-semibold mb-1'>{event.title}</h3>
                                            <p className='mb-1 text-xs'>{event.description}</p>
                                            <p className='text-xs'><strong>Date:</strong> {formatDate(event.date)}</p>
                                        </li>
                                    ))}
                                </ul>
                        </section>

                        <section className=' flex-1 rounded-lg shadow-lg p-2 border-2'>
                            <h2 className='text-md mb-4 font-semibold text-[#333333]'>Announcements</h2>
                            <ul className='list-none'>
                                {announcements.map(announcement => (
                                    <li key={announcement.id} className='mb-3 relative pl-6'>
                                        <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full'></span>
                                        <p className='text-xs'>{announcement.message}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </Content>
        </div>
    )
}

export default StudentDashboard
