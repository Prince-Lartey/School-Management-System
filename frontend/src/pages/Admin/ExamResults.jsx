import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Content } from '../../styles/ExamStyles'
import axios from 'axios'

const ExamResults = () => {
    const [isOpen, setIsOpen] = useState(true)

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_DEV_BASE_URL;

    // Retrieve registration code to create a dropdown
    const [exam, setExam] = useState([])

    useEffect(() => {
        axios.get(`${API_URL}/auth/exam`)
        .then(result => {
            if(result.data.Status) {
                setExam(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    // Retrieve student to create a dropdown
    const [student, setStudent] = useState([])

    useEffect(() => {
        axios.get(`${API_URL}/auth/student`)
        .then(result => {
            if(result.data.Status) {
                setStudent(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    // Post exam score in the database
    const [examScore, setExamScore] = useState({
        examRegCode: '',
        registrationNumber: '',
        marks: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate that all fields are filled
        if (!examScore.examRegCode.trim() || !examScore.registrationNumber.trim() || !examScore.marks.trim()) {
            toast.error('All fields are required!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        axios.post(`${API_URL}/auth/exam-results`, examScore)
        .then(result => {
            if (result.data.Status) {
                toast.success('Score submitted successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setExamScore({
                    examRegCode: '',
                    registrationNumber: '',
                    marks: ''
                })
            }else {
                toast.error(result.data.Error, { autoClose: 5000 });
                console.log(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }
    // Retrieve exam results by registration code
    const [selectedExamRegCode, setSelectedExamRegCode] = useState('');
    const [examResults, setExamResults] = useState([]);

    const handleFetchResults = (e) => {
        e.preventDefault();
        axios.get(`${API_URL}/auth/exam-results/${selectedExamRegCode}`)
            .then(result => {
                if (result.data.Status) {
                    setExamResults(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    }

    return (
        <div className='flex font-poppins'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Exam Results</h2>
                    <form className='mb-10'>
                        <select name="registration code" id="registration code" value={examScore.examRegCode} required className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setExamScore({...examScore, examRegCode: e.target.value})}>
                            <option value="" className='text-gray-500'>Select Registration Code</option>
                            {exam.map(exam => {
                                return <option key={exam.registrationCode} value={exam.registrationCode}>{exam.registrationCode}</option>
                            })}
                        </select>

                        <select name="student" id="student" value={examScore.registrationNumber} required className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setExamScore({...examScore, registrationNumber: e.target.value})}>
                            <option value="" className='text-gray-500'>Select Student</option>
                            {student.map(student => {
                                return <option key={student.registrationNumber} value={student.registrationNumber}>{student.name}</option>
                            })}
                        </select>

                        <input type='number' value={examScore.marks} placeholder='Add Marks' className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setExamScore({...examScore, marks: e.target.value})}/>
                        
                        <button type='submit' className="py-2 px-4 mt-2.5 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-700 transition-colors duration-300" onClick={handleSubmit}>Submit Score</button>
                    </form>

                    <h3 className='text-xl font-semibold mb-1'>Students Scores</h3>
                    <form className='mb-10'>
                        <select name="registration code" id="registration code" required className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setSelectedExamRegCode(e.target.value)}>
                            <option value="" className='text-gray-500'>Select Registration Code</option>
                            {exam.map(exam => (
                                <option key={exam.registrationCode} value={exam.registrationCode}>
                                    {exam.registrationCode}
                                </option>
                            ))}
                        </select>
                        <button type='submit' className="py-2 px-4 mt-2.5 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-700 transition-colors duration-300" onClick={handleFetchResults}>
                            Fetch Results
                        </button>
                    </form>
                    
                    {examResults.length > 0 && (
                        <div>
                            <h3 className='font-semibold mb-5'>Exam Results:</h3>
                            <table className='w-full border-gray-300'>
                                <thead className='bg-gray-200 text-left'>
                                    <tr>
                                        <th className='py-2 px-4 border-b '>Student Name</th>
                                        <th className='py-2 px-4 border-b '>Registration Number</th>
                                        <th className='py-2 px-4 border-b '>Marks</th>
                                    </tr>
                                </thead>
                                <tbody className='text-left'>
                                    {examResults.map(result => (
                                        <tr key={result.studentName}>
                                            <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{result.studentName}</td>
                                            <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{result.registrationNumber}</td>
                                            <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{result.marks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Content>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default ExamResults
