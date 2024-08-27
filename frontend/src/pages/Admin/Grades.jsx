import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/ClassesStyles'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';


const Grades = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [gradeName, setGradeName] = useState('')
    const [grade, setGrade] = useState([])
    const [studentsByGrade, setStudentsByGrade] = useState({});
    const [openGradeId, setOpenGradeId] = useState(null);

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!gradeName.trim()) {
            toast.error('Grade name is required!', {
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
        
        axios.post(`${API_URL}/auth/add_grade`, { gradeName })
        .then(result => {
            if (result.data.Status) {
                toast.success('Grade added successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setGradeName('');
            }else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        axios.get(`${API_URL}/auth/grade`)
        .then(result => {
            if(result.data.Status) {
                setGrade(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    const toggleDropdown = (gradeId) => {
        if (openGradeId === gradeId) {
            setOpenGradeId(null);
        } else {
            setOpenGradeId(gradeId);

            if (!studentsByGrade[gradeId]) {
                axios.get(`${API_URL}/auth/students_by_grade/${gradeId}`)
                    .then(result => {
                        if (result.data.Status) {
                            setStudentsByGrade(prev => ({
                                ...prev,
                                [gradeId]: result.data.Result
                            }));
                        } else {
                            alert(result.data.Error);
                        }
                    })
                    .catch(error => console.log(error));
            }
        }
    };

    return (
        <div className='flex md:flex-col md:pl-0 font-poppins'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Grades</h2>
                    <form className='mb-10'>
                        <input type='text' placeholder='Enter Grade Name'  className="p-2 mr-2.5 border border-gray-300 rounded" onChange={(e) => setGradeName(e.target.value)} />
                        <button type='submit' className="py-2 px-4 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-700 transition-colors duration-300" onClick={handleSubmit}>Add Grade</button>
                    </form>

                    <h2 className='mb-5 font-semibold'>Grades</h2>
                    <ul className="list-none p-0">
                        {grade.map(grade => (
                            <li key={grade.id} className='mb-4 border-b py-2'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm'>{grade.gradeName}</span>
                                    <button onClick={() => toggleDropdown(grade.id)}>{openGradeId === grade.id ? <FaChevronUp /> : <FaChevronDown />}</button>
                                </div>
                                {openGradeId === grade.id && studentsByGrade[grade.id] && (
                                    <ul className='mt-2'>
                                        {studentsByGrade[grade.id].map(student => (
                                            <li key={student.registrationNumber} className='py-1 text-sm pl-4'>
                                                <strong>{student.name}</strong> - {student.registrationNumber}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </Content>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default Grades
