import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/ExamStyles'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ToggleButton from '../../constants/togglebutton';


// Generate Registration Code Function
const generateRegistrationCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let registrationCode = '';
    for (let i = 0; i < 5; i++) {
        registrationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return registrationCode;
}

const CreateExams = () => {
    const [isOpen, setIsOpen] = useState(true)

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

    //Generate random 5 character code
    const [registrationCode, setRegistrationCode] = useState('');

    useEffect(() => {
        const code = generateRegistrationCode();
        setRegistrationCode(code);
    }, []);

    // Post exam details in the database
    const [exam, setExam] = useState({
        examName: '',
        subject_id: '',
        registrationCode: '',
        marks: ''
    })
    

    const handleSubmit = (e) => {
        e.preventDefault()

        // Add the registration code to the exam object
        const examWithCode = { ...exam, registrationCode };

        // Validate that all fields are filled
        if (!examWithCode.examName.trim() || !examWithCode.subject_id.trim() || !examWithCode.registrationCode.trim() || !examWithCode.marks.trim()) {
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
        
        axios.post(`${API_URL}/auth/create_exam`, examWithCode)
        .then(result => {
            if (result.data.Status) {
                toast.success('Exam details posted successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                fetchExams()

                setExam({
                    examName: '',
                    subject_id: '',
                    registrationCode: '',
                    marks: ''
                })
            }else {
                console.log(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }

    // Retrieve exam details from database
    const [addExam, setAddExam] = useState([])

    const fetchExams = () => {
        axios.get(`${API_URL}/auth/exam`)
        .then(result => {
            if(result.data.Status) {
                setAddExam(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        fetchExams()
    }, [])

    // Retrieve subject to create a dropdown
    const [subjects, setSubjects] = useState([])

    useEffect(() => {
        axios.get(`${API_URL}/auth/subject`)
        .then(result => {
            if(result.data.Status) {
                setSubjects(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    // State for editing student details
    const [editModal, setEditModal] = useState(false);
    const [examToEdit, setExamToEdit] = useState({});

    const openEditModal = (registrationCode) => {
        axios.get(`${API_URL}/auth/exam/${registrationCode}`)
            .then(result => {
                if (result.data.Status) {
                    setExamToEdit(result.data.Result[0]);
                    setEditModal(true);
                } else {
                    alert(result.data.Error || "No data found");
                }
            })
            .catch(error => console.log(error));
    };
    const closeEditModal = () => {
        setEditModal(false);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        // Validate all required fields are filled
        const { examName, subject_id, marks } = examToEdit;

        if (!examName || !subject_id || marks === undefined) {
            toast.error('All fields are required.', { autoClose: 5000 });
            return;
        }

        axios.put(`${API_URL}/auth/edit_exam/${examToEdit.registrationCode}`, examToEdit)
            .then(result => {
                if (result.data.Status) {
                    toast.success("Exam updated successfully!", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setAddExam((prevExams) => prevExams.map((exam) => exam.registrationCode === examToEdit.registrationCode ? examToEdit : exam));
                    setEditModal(false);
                } else {
                    console.log(result.data.Error)
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    };

    // Delete exam details
    const [showModal, setShowModal] = useState(false);
    const [examToDelete, setExamToDelete] = useState(null);

    const handleDelete = () => {
        
        axios.delete(`${API_URL}/auth/delete_exam/` + examToDelete)
        .then(result => {
            if (result.data.Status){
                toast.success('Exam removed successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setAddExam((prevExams) =>
                    prevExams.filter((exam) => exam.registrationCode !== examToDelete)
                );
                setShowModal(false);
            }
            else {
                alert(result.data.Error)
            }
        })
        .catch(error => {
            console.error('Error occurred while deleting exam:', error);
            alert('Failed to delete exam. Please try again later.');
        });
    }

    const openModal = (registrationCode) => {
        setExamToDelete(registrationCode);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };

    const [toggleState, setToggleState] = useState({})
    const handleToggle = (id) => {
        setToggleState((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <div className='flex font-poppins'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Exams Details</h1>
                    <form className='flex flex-col max-w-[400px] mb-10'>
                        <label className='mb-2.5'>Name: </label>
                        <input type='text' value={exam.examName} required className='p-2 mb-2.5 border border-gray-300 rounded-md' onChange={(e) => setExam({...exam, examName: e.target.value})}/>

                        <label className='mb-2.5'>Subject: </label>
                        <select name="subject" id="subject" value={exam.subject_id} required type='text' className='p-2 mb-2.5 border border-gray-300 rounded-md ' onChange={(e) => setExam({...exam, subject_id: e.target.value})}>
                            <option value="">Select Subject</option>
                            {subjects.map(subject => {
                                return <option key={subject.id} value={subject.id}>{subject.subjectName}</option>
                            })}
                        </select>

                        <label htmlFor="registrationCode" className='mb-2.5'>Registration Code: </label>
                        <input type='text' id="registrationCode" name="registrationCode" value={registrationCode} readOnly className='p-2 mb-2.5 border border-gray-300 rounded-md '/>

                        <label className='mb-2.5'>Marks: </label>
                        <input type='number' value={exam.marks} required className='p-2 mb-2.5 border border-gray-300 rounded-md' onChange={(e) => setExam({...exam, marks: e.target.value})}/>
                        
                        <button type='submit' className='px-5 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors duration-300' onClick={handleSubmit}>Add Exam</button>
                    </form>

                    <h3 className='font-semibold mb-5'>Exam Details: </h3>
                    <table className='w-full border-gray-300'>
                        <thead className='bg-gray-200 text-left'>
                            <tr>
                                <th className='py-2 px-4 border-b '>Exam Title</th>
                                <th className='py-2 px-4 border-b '>Subject</th>
                                <th className='py-2 px-4 border-b '>Exam Code</th>
                                <th className='py-2 px-4 border-b '>Marks</th>
                                <th className='py-2 px-4 border-b '>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-left'>
                            {
                                addExam.map(addExam => (
                                    <tr key={addExam.registrationCode}>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addExam.examName}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addExam.subjectName}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addExam.registrationCode}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addExam.marks}</td>
                                        <td className='py-2 px-4 border-b'>
                                            <div className='relative'>
                                                <ToggleButton onToggle={() => handleToggle(addExam.registrationCode)} />
                                                <ul className={`absolute right-0 bg-gray-100 border border-gray-300 shadow-md rounded p-1 w-40 text-xs text-left overflow-hidden transition-all duration-500 ease-out ${toggleState[addExam.registrationCode] ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded transition-colors duration-300' onClick={() => openEditModal(addExam.registrationCode)}>Edit Exam Details</li>
                                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded transition-colors duration-300' onClick={() => openModal(addExam.registrationCode)}>Remove Exam</li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </Content>
            <ToastContainer position="top-right" />

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-md w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to remove exam details?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-300 px-4 py-2 mr-2 rounded hover:bg-gray-400" onClick={closeModal}>Cancel</button>
                            <button className="bg-red-400 px-4 py-2 text-white rounded hover:bg-red-500" onClick={handleDelete}>Remove</button>
                        </div>
                    </div>
                </div>
            )}

            {editModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-md w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Edit Exam Details</h2>
                        <form onSubmit={handleEditSubmit}>
                            <input type="text" value={examToEdit.examName} onChange={(e) => setExamToEdit({ ...examToEdit, examName: e.target.value })} placeholder="Exam Title" className="p-2 mb-2 w-full border border-gray-300 rounded" />
                            
                            <select value={examToEdit.subject_id} onChange={(e) => setExamToEdit({ ...examToEdit, subject_id: e.target.value })} className="p-2 mb-2 w-full border border-gray-300 rounded">
                                <option value="" className='text-gray-500'>Select Subject</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.subjectName}</option>
                                ))}
                            </select>

                            <input type="number"value={examToEdit.marks} onChange={(e) => setExamToEdit({ ...examToEdit, marks: e.target.value })} placeholder="Marks" className="p-2 mb-2 w-full border border-gray-300 rounded" />

                            <div className="flex justify-end mt-4">
                                <button type="button" className="py-2 px-4 bg-gray-200 text-gray-700 rounded mr-2 hover:bg-gray-300 transition-colors duration-300" onClick={closeEditModal}>Cancel</button>
                                <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
        </div>
    )
}

export default CreateExams
