import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/TeachersStyles'
import ToggleButton from '../../constants/togglebutton.jsx'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Teachers = () => {
    const [isOpen, setIsOpen] = useState(true);

    const [subjects, setSubjects] = useState([]);
    const [teacher, setTeacher] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        qualification: '',
        subjects: []
    });

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

    useEffect(() => {
        axios.get(`${API_URL}/auth/subject`)
            .then(result => {
                if (result.data.Status) {
                    setSubjects(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    }, []);

    const handleSubjectChange = (e) => {
        const options = e.target.options;
        const selectedSubjects = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedSubjects.push(options[i].value);
            }
        }
        setTeacher({ ...teacher, subjects: selectedSubjects });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if all fields are filled
        const { name, email, password, phone, address, qualification, subjects } = teacher;
        if (!name || !email || !password || !phone || !address || !qualification || subjects.length === 0) {
            toast.error('Please fill in all fields before submitting.', {
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

        axios.post(`${API_URL}/auth/add_teacher`, teacher)
            .then(result => {
                if (result.data.Status) {
                    toast.success('Teacher added successfully!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    // Update the list of teachers with the newly added teacher
                    setTeachers((prevTeachers) => [
                        ...prevTeachers,
                        { ...teacher, id: result.data.teacherId, subjects: subjects.filter(subject => teacher.subjects.includes(subject.id)).map(subject => subject.subjectName).join(', ') }
                    ]);

                    // Clear the form fields
                    setTeacher({
                        name: '',
                        email: '',
                        password: '',
                        phone: '',
                        address: '',
                        qualification: '',
                        subjects: []
                    });
                } else {
                    console.log(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    };

    const [teachers, setTeachers] = useState([]);
    useEffect(() => {
        axios.get(`${API_URL}/auth/teachers`)
            .then(result => {
                if (result.data.Status) {
                    console.log(result.data.Result)
                    setTeachers(result.data.Result);
                } else {
                    console.log(result.data.Error)
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    }, []);

    // Delete teacher
    const [showModal, setShowModal] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);

    const handleDelete = () => {
        
        axios.delete(`${API_URL}/auth/delete_teacher/` + teacherToDelete)
        .then(result => {
            if (result.data.Status){
                toast.success('Teacher removed successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setTeachers((prevTeachers) =>
                    prevTeachers.filter((teacher) => teacher.id !== teacherToDelete)
                );
                setShowModal(false);
            }
            else {
                alert(result.data.Error)
            }
        })
        .catch(error => {
            console.error('Error occurred while removing teacher:', error);
            alert('Failed to remove teacher. Please try again later.');
        });
    }

    const openModal = (id) => {
        setTeacherToDelete(id);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };

    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const handleViewDetails = (teacher) => {
        setSelectedTeacher(teacher);
    };

    const [toggleState, setToggleState] = useState({})
    const handleToggle = (id) => {
        setToggleState((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <div className='flex font-poppins  md:flex-col md:pl-0'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Teachers</h2>
                    <form className='mb-5 '>
                        <input type='text' required placeholder='Name' className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}/>
                        <input type='email' required placeholder='Email' className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setTeacher({ ...teacher, email: e.target.value })} />
                        <input type='password' required placeholder='Password' className="p-2 mt-2.5 mr-2.5 border border-gray-300 rounded" onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}/>
                        <input type='phone' required placeholder='Phone Number' className="p-2 mt-2.5 mr-2.5 border border-gray-300 rounded" onChange={(e) => setTeacher({ ...teacher, phone: e.target.value })}/>
                        <input type='text' required placeholder='Address: 123 Main Street' className="p-2 mt-2.5 mr-2.5 border border-gray-300 rounded" onChange={(e) => setTeacher({ ...teacher, address: e.target.value })} />
                        <input type='text' required placeholder='Qualification' className="p-2 mt-2.5 mr-2.5 border border-gray-300 rounded" onChange={(e) => setTeacher({ ...teacher, qualification: e.target.value })}/>
                        <div>
                            <select multiple name="subjects" id="subjects" className='p-2 mb-2.5 mt-2.5 border border-gray-300 rounded-md' onChange={handleSubjectChange}>
                            <option value="" className='text-gray-500'>Select Subject/s</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.subjectName}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button type='submit' className="py-2 px-4 mt-2.5 bg-blue-500 text-white border-none rounded cursor-pointer block hover:bg-blue-700 transition-colors duration-300" onClick={handleSubmit}>Add Teacher</button>
                    </form>
                    
                    <h3 className='font-semibold mb-5'>List of all Teachers</h3>
                    <table className='w-full border-gray-300'>
                        <thead className='bg-gray-200 text-left'>
                            <tr>
                                <th className='py-2 px-4 border-b '>Name</th>
                                <th className='py-2 px-4 border-b '>Email</th>
                                <th className='py-2 px-4 border-b '>Phone</th>
                                <th className='py-2 px-4 border-b '>Subjects taught</th>
                                <th className='py-2 px-4 border-b '>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-left'>
                            {teachers.map(teacher => (
                                <tr key={teacher.id}>
                                    <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{teacher.name}</td>
                                    <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{teacher.email}</td>
                                    <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{teacher.phone}</td>
                                    <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{teacher.subjects}</td>
                                    <td className='py-2 px-4 border-b'>
                                            <div className='relative'>
                                                <ToggleButton onToggle={() => handleToggle(teacher.id)} />
                                                <ul className={`absolute right-0 bg-gray-100 border border-gray-300 shadow-md rounded p-1 w-40 text-xs overflow-hidden transition-all duration-500 ease-out ${toggleState[teacher.id] ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded transition-colors duration-300' onClick={() => handleViewDetails(teacher)}>View Teacher Details</li>
                                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded transition-colors duration-300' onClick={() => openModal(teacher.id)}>Remove Teacher</li>
                                                </ul>
                                            </div>
                                        </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Content>
            <ToastContainer position="top-right" />

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-md w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to remove this teacher?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-300 px-4 py-2 mr-2 rounded hover:bg-gray-400 transition-colors duration-300" onClick={closeModal}>Cancel</button>
                            <button className="bg-red-400 px-4 py-2 text-white rounded hover:bg-red-500 transition-colors duration-300" onClick={handleDelete}>Remove</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedTeacher && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-md w-1/2">
                        <h2 className="text-lg font-semibold mb-4">Teacher Details</h2>
                        <p className='mb-1'><strong>Name:</strong> {selectedTeacher.name}</p>
                        <p className='mb-1'><strong>Email:</strong> {selectedTeacher.email}</p>
                        <p className='mb-1'><strong>Phone:</strong> {selectedTeacher.phone}</p>
                        <p className='mb-1'><strong>Address:</strong> {selectedTeacher.address}</p>
                        <p className='mb-1'><strong>Qualification:</strong> {selectedTeacher.qualification}</p>
                        <p><strong>Subjects:</strong> {selectedTeacher.subjects}</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-red-400 px-4 py-2 rounded hover:bg-red-500 transition-colors duration-300" onClick={() => setSelectedTeacher(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Teachers
