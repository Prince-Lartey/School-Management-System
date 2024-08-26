import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/ClassesStyles'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

const Subject = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [subjectName, setSubjectName] = useState('')
    const [subject, setSubject] = useState([])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!subjectName.trim()) {
            toast.error('Subject name is required!', {
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

        axios.post('http://localhost:4000/auth/add_subject', { subjectName })
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
            }else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        axios.get('http://localhost:4000/auth/subject')
        .then(result => {
            if(result.data.Status) {
                setSubject(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    return (
        <div className='flex md:flex-col md:pl-0 font-poppins'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Subjects</h2>
                    <form className='mb-10'>
                        <input type='text' placeholder='Enter Subject Name'  className="p-2 w-[400px] mr-2.5 border border-gray-300 rounded"  onChange={(e) => setSubjectName(e.target.value)}/>
                        <button type='submit' className="py-2 px-4 mt-2.5 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-700 transition-colors duration-300" onClick={handleSubmit}>Add Subject</button>
                    </form>

                    <h2 className='mb-5 font-semibold'>Subjects</h2>
                    <ul className="list-none p-0">
                        {subject.map(subject => (
                            <li key={subject.id} className='mb-4 flex justify-between items-center border-b py-2'>
                                <span className='text-sm'>{subject.subjectName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Content>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default Subject
