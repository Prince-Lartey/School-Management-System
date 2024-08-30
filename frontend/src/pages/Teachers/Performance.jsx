import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/PerformanceStyles'
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Performance = () => {
    const [isOpen, setIsOpen] = useState(true)

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_DEV_BASE_URL;

    const [individualPerformanceData, setIndividualPerformanceData] = useState([]);
    const [schoolPerformanceData, setSchoolPerformanceData] = useState({
        averageScore: 0,
        totalStudents: 0
    });
    const [gradePerformanceData, setGradePerformanceData] = useState([]);

    useEffect(() => {
        // Fetch student performance data
        axios.get(`${API_URL}/auth/student_performance`)
            .then(result => {
                if (result.data.Status) {
                    const performanceData = result.data.Result;
                    setIndividualPerformanceData(performanceData);
                    
                    // Calculate total score and number of students
                    const totalStudents = performanceData.length;
                    const totalScore = performanceData.reduce((acc, student) => acc + student.totalScore, 0);
                    const averageScore = totalStudents ? (totalScore / totalStudents) : 0;
                    
                    setSchoolPerformanceData({
                        averageScore: averageScore.toFixed(2),
                        totalStudents: totalStudents
                    });
                } else {
                    console.log(result.data.Error);
                }
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
    }, []);

    // Prepare data for the line chart
    const lineChartData = {
        labels: gradePerformanceData.map(grade => grade.gradeName),
        datasets: [
            {
                label: 'Average Grade Score',
                data: gradePerformanceData.map(grade => grade.gradeAvgScore),
                fill: false,
                borderColor: '#007bff',
                tension: 0.1
            }
        ]
    };

    const lineChartOptions = {
        scales: {
            y: {
                beginAtZero: false,
                max: 100
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Grade Performance',
            },
        },
    };

    return (
        <div className='flex font-poppins'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>School Performance</h2>
                    <div className='mb-5 bg-white rounded-lg shadow-md p-5'>
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Individual Performance</h2>
                    <div className='mb-5'>
                        {individualPerformanceData.map((student) => (
                            <p key={student.registrationNumber} className='mb-2'>
                                {student.name}: {student.totalScore}
                            </p>
                        ))}
                    </div>
                </div>
            </Content>
        </div>
    )
}

export default Performance
