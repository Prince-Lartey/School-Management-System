import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/StudentsStyles'
import ToggleButton from '../../constants/togglebutton.jsx'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

// Generate Student Registration Number Function
const generateRegistrationNumber = () => {
    const numbers = '0123456789';
    let registrationNumber = '';
    for (let i = 0; i < 6; i++) {
        registrationNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return registrationNumber;
}

const Students = () => {
    const [isOpen, setIsOpen] = useState(true);

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_DEV_BASE_URL;
    
    //Retrieve generated numbers
    const [registrationNumber, setRegistrationNumber] = useState('');

    useEffect(() => {
        const code = generateRegistrationNumber();
        setRegistrationNumber(code);
    }, []);

    // Retrieve grade and gender from database
    const [grades, setGrades] = useState([])
    const [gender, setGender] = useState([])

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

        axios.get(`${API_URL}/auth/gender`)
        .then(result => {
            if(result.data.Status) {
                setGender(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    // Post student details in the database
    const [student, setStudent] = useState({
        name: '',
        registrationNumber: '',
        email: '',
        password: '',
        grade_id: '',
        gender_id: '',
        guardianPhone: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        // Check if all fields are filled
        if (!student.name || !student.email || !student.password || !student.grade_id || !student.gender_id || !student.guardianPhone) {
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
        const studentWithNumber = { ...student, registrationNumber };

        axios.post(`${API_URL}/auth/add_student`, studentWithNumber)
        .then(result => {
            if (result.data.Status) {
                toast.success('Student added successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                // Add the new student to the list
                setAddStudent(prevStudents => [...prevStudents, studentWithNumber]);

                // Reset form fields after submission
                setStudent({
                    name: '',
                    registrationNumber: '',
                    email: '',
                    password: '',
                    grade_id: '',
                    gender_id: '',
                    guardianPhone: ''
                });

                // Generate a new registration number after the student is added
                const newCode = generateRegistrationNumber();
                setRegistrationNumber(newCode);
            }else {
                console.log(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }

    // Retrieve student details from database
    const [addStudent, setAddStudent] = useState([])

    useEffect(() => {
        axios.get(`${API_URL}/auth/student`)
        .then(result => {
            if(result.data.Status) {
                setAddStudent(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }, [])

    // Delete student
    const [showModal, setShowModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    const handleDelete = () => {
        
        axios.delete(`${API_URL}/auth/delete_student/` + studentToDelete)
        .then(result => {
            if (result.data.Status){
                toast.success('Student removed successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setAddStudent((prevStudents) =>
                    prevStudents.filter((student) => student.registrationNumber !== studentToDelete)
                );
                setShowModal(false);
            }
            else {
                alert(result.data.Error)
            }
        })
        .catch(error => {
            console.error('Error occurred while deleting student:', error);
            alert('Failed to delete student. Please try again later.');
        });
    }

    const openModal = (registrationNumber) => {
        setStudentToDelete(registrationNumber);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };

    // State for viewing student details
    const [viewModal, setViewModal] = useState(false);
    const [studentDetails, setStudentDetails] = useState({});

    const openViewModal = (registrationNumber) => {
        axios.get(`${API_URL}/auth/student/${registrationNumber}`)
        .then(result => {
            if (result.data.Status) {
            setStudentDetails(result.data.Result[0]);
            setViewModal(true);
            } else {
            alert(result.data.Error);
            }
        })
        .catch(error => console.log(error));
    }
    const closeViewModal = () => {
        setViewModal(false);
    }

    // State for editing student details
    const [editModal, setEditModal] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState({});

    const openEditModal = (registrationNumber) => {
        axios.get(`${API_URL}/auth/student/${registrationNumber}`)
            .then(result => {
                if (result.data.Status) {
                    setStudentToEdit(result.data.Result[0]);
                    setEditModal(true);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    };
    const closeEditModal = () => {
        setEditModal(false);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        // Check if all edit fields are filled
        if (!studentToEdit.name || !studentToEdit.email || !studentToEdit.grade_id || !studentToEdit.guardianPhone || !studentToEdit.gender_id) {
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

        axios.put(`${API_URL}/auth/edit_student/${studentToEdit.registrationNumber}`, studentToEdit)
            .then(result => {
                if (result.data.Status) {
                    toast.success('Student updated successfully!', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
                    // Update the student list with the new details
                    setAddStudent((prevStudents) => prevStudents.map((student) => student.registrationNumber === studentToEdit.registrationNumber ? studentToEdit : student));
                    setEditModal(false);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    };

    const [toggleState, setToggleState] = useState({})
    const handleToggle = (id) => {
        setToggleState((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <div className='flex font-poppins md:flex-col md:pl-0'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h2 className='text-2xl mb-5 font-semibold text-[#333333]'>Students</h2>
                    <form className='mb-10'>
                        <input type='text' placeholder='Student Name' value={student.name} className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setStudent({...student, name: e.target.value})}/>
                        <input type='number' id="registrationCode" name="registrationCode" value={registrationNumber} readOnly placeholder='Registration Number' className="p-2  mr-2.5 mt-2.5 border border-gray-300 rounded"/>
                        <input type='email' placeholder='Email' value={student.email}  className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setStudent({...student, email: e.target.value})}/>
                        <input type='password' placeholder='Password' value={student.password} className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setStudent({...student, password: e.target.value})}/>
                        <select name="gender" id="gender" value={student.gender_id} required className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setStudent({...student, gender_id: e.target.value})}>
                            <option value="" className='text-gray-500'>Select Gender</option>
                            {gender.map(gender => {
                                return <option key={gender.id} value={gender.id}>{gender.name}</option>
                            })}
                        </select>
                        <select name="grade" id="grade" value={student.grade_id} required className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setStudent({...student, grade_id: e.target.value})}>
                            <option value="" className='text-gray-500'>Select Grade</option>
                            {grades.map(grade => {
                                return <option key={grade.id} value={grade.id}>{grade.gradeName}</option>
                            })}
                        </select>
                        <input type='text' placeholder='Guardian Phone Number' value={student.guardianPhone} className="p-2 mr-2.5 mt-2.5 border border-gray-300 rounded" onChange={(e) => setStudent({...student, guardianPhone: e.target.value})}/>
                        <button type='submit' className="py-2 px-4 mt-2.5 bg-blue-500 text-white border-none rounded cursor-pointer block hover:bg-blue-700 transition-colors duration-300" onClick={handleSubmit}>Add Student</button>
                    </form>

                    <h3 className='font-semibold mb-5'>List of all Students </h3>
                    <table className='w-full border-gray-300'>
                        <thead className='bg-gray-200 text-left'>
                            <tr>
                                <th className='py-2 px-4 border-b '>Student Name</th>
                                <th className='py-2 px-4 border-b '>Registration Number</th>
                                <th className='py-2 px-4 border-b '>Sex</th>
                                <th className='py-2 px-4 border-b '>Grade</th>
                                <th className='py-2 px-4 border-b '>Email</th>
                                <th className='py-2 px-4 border-b '>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-left'>
                            {
                                addStudent.map(addStudent => (
                                    <tr key={addStudent.registrationNumber}>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addStudent.name}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addStudent.registrationNumber}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addStudent.genderName}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addStudent.gradeName}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addStudent.email}</td>
                                        <td className='py-2 px-4 border-b'>
                                            <div className='relative'>
                                                <ToggleButton onToggle={() => handleToggle(addStudent.registrationNumber)} />
                                                <ul className={`absolute right-0 bg-gray-100 border border-gray-300 shadow-md rounded p-1 w-40 text-xs overflow-hidden transition-all duration-500 ease-out ${toggleState[addStudent.registrationNumber] ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded' onClick={() => openViewModal(addStudent.registrationNumber)}>View Student Details</li>
                                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded' onClick={() => openEditModal(addStudent.registrationNumber)}>Edit Student Details</li>
                                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded' onClick={() => openModal(addStudent.registrationNumber)}>Remove Student</li>
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
                        <p>Are you sure you want to remove this student?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-300 px-4 py-2 mr-2 rounded hover:bg-gray-400" onClick={closeModal}>Cancel</button>
                            <button className="bg-red-400 px-4 py-2 text-white rounded hover:bg-red-500" onClick={handleDelete}>Remove</button>
                        </div>
                    </div>
                </div>
            )}

            {viewModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-md w-1/3">
                        <h2 className="text-lg font-bold mb-4">Student Details</h2>
                        <p className='mb-2'><strong>Name:</strong> {studentDetails.name}</p>
                        <p className='mb-2'><strong>Registration Number:</strong> {studentDetails.registrationNumber}</p>
                        <p className='mb-2'><strong>Email:</strong> {studentDetails.email}</p>
                        <p className='mb-2'><strong>Sex:</strong> {studentDetails.genderName}</p>
                        <p className='mb-2'><strong>Grade:</strong> {studentDetails.gradeName}</p>
                        <p><strong>Guardian Phone:</strong> {studentDetails.guardianPhone}</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-red-400 px-4 py-2 rounded hover:bg-red-500" onClick={closeViewModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {editModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-md w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Edit Student Details</h2>
                        <form onSubmit={handleEditSubmit}>
                            <input type="text" value={studentToEdit.name} onChange={(e) => setStudentToEdit({ ...studentToEdit, name: e.target.value })} placeholder="Name" className="p-2 mb-2 w-full border border-gray-300 rounded" />
                            <input type="email" value={studentToEdit.email} onChange={(e) => setStudentToEdit({ ...studentToEdit, email: e.target.value })} placeholder="Email" readOnly className="p-2 mb-2 w-full border border-gray-300 rounded" />
                            <input type="text" value={studentToEdit.guardianPhone} onChange={(e) => setStudentToEdit({ ...studentToEdit, guardianPhone: e.target.value })} placeholder="Guardian Phone" className="p-2 mb-2 w-full border border-gray-300 rounded" />
                            <select value={studentToEdit.gender_id} onChange={(e) => setStudentToEdit({ ...studentToEdit, gender_id: e.target.value })} className="p-2 mb-2 w-full border border-gray-300 rounded">
                                <option value="" className='text-gray-500'>Select Gender</option>
                                {gender.map(gender => (
                                    <option key={gender.id} value={gender.id}>{gender.name}</option>
                                ))}
                            </select>
                            <select value={studentToEdit.grade_id} onChange={(e) => setStudentToEdit({ ...studentToEdit, grade_id: e.target.value })} className="p-2 mb-2 w-full border border-gray-300 rounded">
                                <option value="" className='text-gray-500'>Select Grade</option>
                                {grades.map(grade => (
                                    <option key={grade.id} value={grade.id}>{grade.gradeName}</option>
                                ))}
                            </select>
                            <div className="flex justify-end mt-4">
                                <button type="button" className="py-2 px-4 bg-gray-200 text-gray-700 rounded mr-2 hover:bg-gray-300" onClick={closeEditModal}>Cancel</button>
                                <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Students
