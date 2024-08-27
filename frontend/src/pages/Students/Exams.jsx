import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/ExamStyles'
import {Bar} from 'react-chartjs-2'
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

// Register the components of Chart.js that you need
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentExams = () => {
    const [isOpen, setIsOpen] = useState(true)

    const [examResults, setExamResults] = useState([]);

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

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

    // Prepare data for the bar chart
    const subjects = examResults.map(result => result.subjectName);
    const marks = examResults.map(result => result.marks);

    const data = {
        labels: subjects,
        datasets: [
            {
                label: 'Marks',
                data: marks,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100, // Set maximum y-axis value to 100
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Your Exam Results',
            },
        },
    };

    // Calculate the total marks
    const totalMarks = marks.reduce((total, mark) => total + mark, 0);

    return (
        <div className='flex font-poppins md:flex-col md:pl-0'> 
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Exams Results</h1>
                    {examResults.length > 0 ? (
                        <>
                            <Bar data={data} options={options} />
                            <div className='mt-5'>
                                <h2 className='text-lg font-semibold text-[#333333]'>Total Marks: {totalMarks}</h2>
                            </div>
                        </>
                    ) : (
                        <p className='text-red-500'>No exam results available.</p>
                    )}
                </div>
            </Content>
        </div>
    )
}

export default StudentExams
