import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/AssignmentsStyles'
import ToggleButton from '../../constants/togglebutton.jsx'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import moment from 'moment'

const Assignment = () => {
    const [isOpen, setIsOpen] = useState(true)

    // Retrieve subject and grade from database
    const [subjects, setSubjects] = useState([])
    const [grades, setGrades] = useState([])

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_DEV_BASE_URL;


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

    useEffect(() => {
        axios.get(`${API_URL}/auth/grade`)
        .then(result => {
            if(result.data.Status) {
                setGrades(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    // Post assignment to database
    const [assignment, setAssignment] = useState({
        subject_id: '',
        title: '',
        description: '',
        grade_id: '',
        deadline: ''
    })
    
    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate that all fields are filled
        if (!assignment.subject_id || !assignment.title.trim() || !assignment.description.trim() || !assignment.grade_id || !assignment.deadline.trim()) {
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

        axios.post(`${API_URL}/auth/add_assignment`, assignment)
        .then(result => {
            if (result.data.Status) {
                toast.success('Assignment details posted successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                // Add the new assignment to the list and reset the form
                fetchAssignments();

                 // Reset form fields after submission
                setAssignment({
                    subject_id: '',
                    title: '',
                    description: '',
                    grade_id: '',
                    deadline: ''
                });
            }else {
                console.log(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }

    // Retrieve assignment from database
    const [addAssignment, setAddAssignment] = useState([])

    const fetchAssignments = () => {
        axios.get(`${API_URL}/auth/assignment`)
        .then(result => {
            if(result.data.Status) {
                setAddAssignment(result.data.Result);
            } else {
                alert(result.data.Error);
            }
        })
        .catch(error => console.log(error));
    };
    
    useEffect(() => {
        fetchAssignments();
    }, []);

    // State for editing student details
    const [editModal, setEditModal] = useState(false);
    const [assignmentToEdit, setAssignmentToEdit] = useState({});

    // Open edit modal
    const openEditModal = (id) => {
        const assignment = addAssignment.find(a => a.id === id);
        setAssignmentToEdit(assignment);
        setEditModal(true);
    };

    // Close edit modal
    const closeEditModal = () => {
        setEditModal(false);
    };

    // Handle edit submission
    const handleEditSubmit = (e) => {
        e.preventDefault();

        // Validate all required fields are filled
        const { subject_id, title, description, grade_id, deadline } = assignmentToEdit;

        if (!subject_id || !title || !description || !grade_id || !deadline) {
            toast.error('All fields are required.', { autoClose: 5000 });
            return;
        }

        axios.put(`${API_URL}/auth/update_assignment/${assignmentToEdit.id}`, assignmentToEdit)
        .then(result => {
            if (result.data.Status) {
            toast.success('Assignment updated successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setAddAssignment(addAssignment.map(a => a.id === assignmentToEdit.id ? assignmentToEdit : a));
            setEditModal(false);
            } else {
            alert(result.data.Error);
            }
        })
        .catch(error => console.log(error));
    };

    // State for deleting assignment details
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState(null);

    const handleDelete = () => {
        
        axios.delete(`${API_URL}/auth/delete_assignment/` + assignmentToDelete)
        .then(result => {
            if (result.data.Status){
                toast.success('Assignment removed successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setAddAssignment((prevAssignments) =>
                    prevAssignments.filter((assignment) => assignment.id !== assignmentToDelete)
                );
                setShowDeleteModal(false);
            }
            else {
                alert(result.data.Error)
            }
        })
        .catch(error => {
            console.error('Error occurred while deleting assignment:', error);
            alert('Failed to delete assignment. Please try again later.');
        });
    }

    const openDeleteModal = (id) => {
        setAssignmentToDelete(id);
        setShowDeleteModal(true);
    };
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const [toggleState, setToggleState] = useState({})
    const handleToggle = (id) => {
        setToggleState((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('DD MMM YYYY')
    };

    return (
        <div className='flex font-poppins md:flex-col md:pl-0'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Assignments</h2>
                    <form className='mb-10'>
                        <select name="subject" id="subject" value={assignment.subject_id} required className="p-2.5 mb-2.5 border border-gray-300 rounded-md w-full" onChange={(e) => setAssignment({...assignment, subject_id: e.target.value})}>
                            <option value="">Select Subject</option>
                            {subjects.map(subject => {
                                return <option key={subject.id} value={subject.id}>{subject.subjectName}</option>
                            })}
                        </select>
                        
                        <select name="grade" id="grade" value={assignment.grade_id} required className="p-2.5 mb-2.5 border border-gray-300 rounded-md w-full" onChange={(e) => setAssignment({...assignment, grade_id: e.target.value})}>
                            <option value="">Select Grade</option>
                            {grades.map(grade => {
                                return <option key={grade.id} value={grade.id}>{grade.gradeName}</option>
                            })}
                        </select>
                        
                        <input type='text' value={assignment.title} required placeholder='Enter Assignment Title' className="p-2.5 mb-2.5 border border-gray-300 rounded-md w-full" onChange={(e) => setAssignment({...assignment, title: e.target.value})} />
                        
                        <textarea value={assignment.description} placeholder='Enter Assignment description' className='p-2.5 mb-2.5 border border-gray-300 rounded-md w-full resize-y' onChange={(e) => setAssignment({...assignment, description: e.target.value})}></textarea>
                        
                        <input type="date" value={assignment.deadline} required placeholder='Enter Assignment Deadline' className="p-2.5 mb-2.5 border border-gray-300 rounded-md w-full" min={moment().format('YYYY-MM-DD')} onChange={(e) => setAssignment({...assignment, deadline: e.target.value})}/>
                        
                        <button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors duration-300' onClick={handleSubmit}>Add Assignment</button>
                    </form>

                    <h2 className='mb-5 font-semibold'>List of Assignments</h2>
                    <table className='w-full border-gray-300'>
                        <thead className='bg-gray-200 text-left'>
                            <tr>
                                <th className='py-2 px-4 border-b '>Subject</th>
                                <th className='py-2 px-4 border-b '>Grade</th>
                                <th className='py-2 px-4 border-b '>Title</th>
                                <th className='py-2 px-4 border-b '>Description</th>
                                <th className='py-2 px-4 border-b '>Deadline</th>
                                <th className='py-2 px-4 border-b '>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-left'>
                            {
                                addAssignment.map(addAssignment => (
                                    <tr key={addAssignment.id}>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addAssignment.subjectName}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addAssignment.gradeName}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addAssignment.title}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addAssignment.description}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{formatDate(addAssignment.deadline)}</td>
                                        <td className='py-2 px-4 border-b'>
                                            <div className='relative'>
                                                <ToggleButton onToggle={() => handleToggle(addAssignment.id)} />
                                                <ul className={`absolute right-0 bg-gray-100 border border-gray-300 shadow-md rounded p-1 w-40 text-xs text-left overflow-hidden transition-all duration-500 ease-out ${toggleState[addAssignment.id] ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded' onClick={() => openEditModal(addAssignment.id)}>Edit Assignment</li>
                                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded' onClick={() => openDeleteModal(addAssignment.id)}>Remove Assignment</li>
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

            {editModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-md w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Edit Assignment</h2>
                        <form onSubmit={handleEditSubmit}>
                            <input type="text" value={assignmentToEdit.title} onChange={(e) => setAssignmentToEdit({ ...assignmentToEdit, title: e.target.value })} placeholder="Title" className="p-2 mb-2 w-full border border-gray-300 rounded"/>

                            <textarea value={assignmentToEdit.description} onChange={(e) => setAssignmentToEdit({ ...assignmentToEdit, description: e.target.value })} placeholder="Description" className="p-2 mb-2 w-full border border-gray-300 rounded"/>

                            <select value={assignmentToEdit.subject_id} onChange={(e) => setAssignmentToEdit({ ...assignmentToEdit, subject_id: e.target.value })} className="p-2 mb-2 w-full border border-gray-300 rounded">
                                <option value="">Select Subject</option>
                                {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.subjectName}</option>
                                ))}
                            </select>

                            <select value={assignmentToEdit.grade_id} onChange={(e) => setAssignmentToEdit({ ...assignmentToEdit, grade_id: e.target.value })} className="p-2 mb-2 w-full border border-gray-300 rounded">
                                <option value="">Select Grade</option>
                                {grades.map(grade => (
                                <option key={grade.id} value={grade.id}>{grade.gradeName}</option>
                                ))}
                            </select>

                            <input type="date" value={assignmentToEdit.deadline} min={moment().format('YYYY-MM-DD')} onChange={(e) => setAssignmentToEdit({ ...assignmentToEdit, deadline: e.target.value })} className="p-2 mb-2 w-full border border-gray-300 rounded"/>
                            
                            <div className="flex justify-end mt-4">
                                <button type="button" className="py-2 px-4 bg-gray-200 text-gray-700 rounded mr-2 hover:bg-gray-300" onClick={closeEditModal}>Cancel</button>
                                <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-md w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to remove this assignment?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-300 px-4 py-2 mr-2 rounded hover:bg-gray-400" onClick={closeDeleteModal}>Cancel</button>
                            <button className="bg-red-400 px-4 py-2 text-white rounded hover:bg-red-500" onClick={handleDelete}>Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Assignment
