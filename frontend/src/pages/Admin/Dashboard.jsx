import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Content } from '../../styles/DashboardStyles';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { BsPeopleFill, BsCheckCircleFill, BsXCircleFill, BsPersonFill, BsFillGridFill } from 'react-icons/bs';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [totalGrades, setTotalGrades] = useState(0);
    const [events, setEvents] = useState([]);
    // const [announcements, setAnnouncements] = useState([]);
    const [bestPerformers, setBestPerformers] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [studentCountsByGrade, setStudentCountsByGrade] = useState([]);
    const [totalPresentToday, setTotalPresentToday] = useState(0);
    const [totalAbsentToday, setTotalAbsentToday] = useState(0);
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:4000/auth/student')
            .then(result => {
                if (result.data.Status) setTotalStudents(result.data.Result.length);
            })
            .catch(error => console.log(error));

        axios.get('http://localhost:4000/auth/teachers')
            .then(result => {
                if (result.data.Status) setTotalTeachers(result.data.Result.length);
            })
            .catch(error => console.log(error));

        axios.get('http://localhost:4000/auth/grade')
            .then(result => {
                if (result.data.Status) setTotalGrades(result.data.Result.length);
            })
            .catch(error => console.log(error));

        axios.get('http://localhost:4000/auth/events')
            .then(result => {
                if (result.data.Status) setEvents(result.data.Result);
            })
            .catch(error => console.log(error));

        axios.get('http://localhost:4000/auth/best_performers')
            .then(result => {
                if (result.data.Status) setBestPerformers(result.data.Result);
            })
            .catch(error => console.log(error));

        // Fetch attendance summary by date
        axios.get('http://localhost:4000/auth/attendance_summary_by_date', { cache: 'no-cache' })
            .then(result => {
                if (result.data.Status) {
                    console.log(result.data.Result)
                    setAttendanceData(result.data.Result);
                }
            })
            .catch(error => console.log(error));

        axios.get('http://localhost:4000/auth/student_count_by_grade')
            .then(result => {
                if (result.data.Status) setStudentCountsByGrade(result.data.Result);
            })
            .catch(error => console.log(error));

        // Fetch attendance summary for today
        axios.get('http://localhost:4000/auth/attendance_summary_today')
            .then(result => {
                if (result.data.Status) {
                    setTotalPresentToday(result.data.Present);
                    setTotalAbsentToday(result.data.Absent);
                }
            })
            .catch(error => console.log(error));

        // Fetch gender distribution data
        axios.get('http://localhost:4000/auth/student_gender_distribution')
            .then(result => {
                if (result.data.Status) {
                    setMaleCount(result.data.maleCount);
                    setFemaleCount(result.data.femaleCount);
                }
            })
            .catch(error => console.log(error));
    }, [])

    const formatDate = (dateString) => {
        return moment(dateString).format('DD MMMM YYYY')
    };

    const attendanceDate = (dateString) => {
        return moment(dateString).format('DD MMM');
    };

    const chartData = {
        labels: attendanceData.map(data => attendanceDate(data.date)),
        datasets: [
            {
                label: 'Number of Students Present',
                data: attendanceData.map(data => data.present_count),
                fill: false,
                borderColor: '#007bff',
                tension: 0.5
            }
        ]
    };
    const lineChartOptions = {
        maintainAspectRatio: false, // This will allow the chart to fill its container
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: function(value) {
                        return Number.isInteger(value) ? value : null; // Display only whole numbers
                    },
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
                text: 'Total Attendance Report',
                position: 'top',
                align: 'start',
                font: {
                    size: 14,
                    weight: 'bold',
                }
            },
        },
    };

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
    
    return (
        <div className='flex font-poppins'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <div className='flex gap-5 flex-1'>
                        <section className='mb-5 flex-1'>
                            <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Dashboard Overview</h2>
                            <div className='flex gap-5'>
                                <Link to='/admin/students' className='flex items-center bg-white p-5 rounded-lg shadow-md transition-transform duration-300 cursor-pointer flex-1 max-w-xs hover:transform hover:-translate-y-1'>
                                    <div className='mr-3 bg-gray-100 text-xl p-2 rounded text-[#2c3e50]'><BsPeopleFill /></div>
                                    <div>
                                        <p className='text-lg font-bold text-[#555555]'>{totalStudents}</p>
                                        <h3 className='text-sm mb-2.5 text-gray-400 font-semibold'>TOTAL STUDENTS</h3>
                                    </div>
                                </Link>

                                <Link to='/admin/attendance/summary' className='flex items-center bg-[#2c3e50] p-5 rounded-lg shadow-md transition-transform duration-300 cursor-pointer flex-1 max-w-xs hover:transform hover:-translate-y-1'>
                                    <div className='mr-3 bg-gray-100 text-xl p-2 rounded text-[#2c3e50]'><BsCheckCircleFill /></div>
                                    <div>
                                        <p className='text-lg font-bold text-white'>{totalPresentToday}</p>
                                        <h3 className='text-sm mb-2.5 text-gray-400 font-semibold'>PRESENT TODAY</h3>
                                    </div>
                                </Link>

                                <Link to='/admin/attendance/summary' className='flex items-center bg-white p-5 rounded-lg shadow-md transition-transform duration-300 cursor-pointer flex-1 max-w-xs hover:transform hover:-translate-y-1'>
                                    <div className='mr-3 bg-gray-100 text-xl p-2 rounded text-[#2c3e50]'><BsXCircleFill /></div>
                                    <div>
                                        <p className='text-lg font-bold text-[#555555]'>{totalAbsentToday}</p>
                                        <h3 className='text-sm mb-2.5 text-gray-400 font-semibold'>ABSENT TODAY</h3>
                                    </div>
                                </Link>

                                <Link to='/admin/grades' className='flex items-center bg-white p-5 rounded-lg shadow-md transition-transform duration-300 cursor-pointer flex-1 max-w-xs hover:transform hover:-translate-y-1'>
                                    <div className='mr-3 bg-gray-100 text-xl p-2 rounded text-[#2c3e50]'><BsFillGridFill /></div>
                                    <div>
                                        <p className='text-lg font-bold text-[#555555]'>{totalGrades}</p>
                                        <h3 className='text-sm mb-2.5 text-gray-400 font-semibold'>TOTAL GRADES</h3>
                                    </div>
                                </Link>

                                <Link to='/admin/teachers' className='flex items-center bg-white p-5 rounded-lg shadow-md transition-transform duration-300 cursor-pointer flex-1 max-w-xs hover:transform hover:-translate-y-1'>
                                    <div className='mr-3 bg-gray-100 text-xl p-2 rounded text-[#2c3e50]'><BsPersonFill /></div>
                                    <div>
                                        <p className='text-lg font-bold text-[#555555]'>{totalTeachers}</p>
                                        <h3 className='text-sm mb-2.5 text-gray-400 font-semibold'>TOTAL TEACHERS</h3>
                                    </div>
                                </Link>
                            </div>
                        </section>
                    </div>

                    <div className='mt-5 flex gap-5 flex-1'>
                        <section className='flex-1 rounded-lg shadow-lg p-2 border-2 relative h-[350px]'>
                            <Line data={chartData} options={lineChartOptions}/>
                        </section>

                        <section className='flex-1 rounded-lg shadow-lg p-2 border-2 relative h-[350px]'>
                            <Bar data={studentCountChartData} options={barChartOptions} />                            
                        </section>
                    </div>

                    <div className='mt-10 flex gap-5 flex-1'>
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
                        
                        <section className='flex-1 rounded-lg shadow-lg p-2 border-2'>
                            <h2 className='text-md mb-5 font-semibold text-[#333333]'>Top 5 Performers</h2>
                            <ul className=''>
                                {bestPerformers.map((student) => (
                                    <li key={student.registrationNumber} className='mb-2 flex justify-between px-2'>
                                        <p className='text-xs'> {student.name}</p>
                                        <div className='border px-2 text-xs rounded-full bg-gray-200 font-bold'>{student.totalScore}</div>
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

export default AdminDashboard
