import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/PerformanceStyles'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StudentPerformance = () => {
    const [isOpen, setIsOpen] = useState(true)

    const [gradePerformanceData, setGradePerformanceData] = useState([]);

    useEffect(() => {
        // Fetch student performance data
        axios.get('http://localhost:4000/auth/grade_performance')
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
                tension: 0.5
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
                    <div className='bg-white rounded-lg shadow-md p-5'>
                        <div className='mb-5'>
                            <Line data={lineChartData} options={lineChartOptions} />
                        </div>
                    </div>
                </div>
            </Content>
        </div>
    )
}

export default StudentPerformance
