import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/LibraryStyles'
import ToggleButton from '../../constants/togglebutton.jsx'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import NotificationIcon from '../../constants/NotificationIcon.jsx'

const Library = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [notifications, setNotifications] = useState(0)
    const [showNotifications, setShowNotifications] = useState(false);
    const [borrowRequests, setBorrowRequests] = useState([]);

    const [library, setLibrary] = useState({
        bookname: '',
        author: ''
    })

    // Post book
    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate that all fields are filled
        if (!library.bookname.trim() || !library.author.trim()) {
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

        axios.post('http://localhost:4000/auth/add_book', library)
        .then(result => {
            if (result.data.Status) {

                toast.success('Book added successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setLibrary({
                    bookname: '',
                    author: ''
                });
            }
            else {
                console.log(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }

    // Retrieve books from database
    const [addBook, setAddBook] = useState([])

    useEffect(() => {
        axios.get('http://localhost:4000/auth/book')
        .then(result => {
            if(result.data.Status) {
                setAddBook(result.data.Result)
            } else {
                alert(result.data.Error)
            }
        })
        .catch(error => console.log(error))

        // Retrieve borrow requests for notifications
        axios.get('http://localhost:4000/auth/borrow_requests')
        .then(result => {
            if (result.data.Status) {
                setBorrowRequests(result.data.BorrowRequests);
                setNotifications(result.data.BorrowRequests.length);
            } else {
                alert(result.data.Error);
            }
        })
        .catch(error => console.log(error));
    }, [])

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
    };

    const handleAcceptRequest = (requestId) => {
        axios.post(`http://localhost:4000/auth/accept_borrow_request/${requestId}`)
            .then(result => {
                if (result.data.Status) {
                    setBorrowRequests(borrowRequests.filter(request => request.id !== requestId));

                    // Send a notification to the student here
                    setNotifications(borrowRequests.length - 1);
                    toast.success('Request accepted successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    };

    const handleRejectRequest = (requestId) => {
        axios.post(`http://localhost:4000/auth/decline_borrow_request/${requestId}`)
            .then(result => {
                if (result.data.Status) {
                    setBorrowRequests(borrowRequests.filter(request => request.id !== requestId));

                    // Send a notification to the student here
                    setNotifications(borrowRequests.length - 1);
                    toast.success('Request declined successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    };

    // Delete book
    const [showModal, setShowModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    const handleDelete = () => {
        
        axios.delete('http://localhost:4000/auth/delete_book/' + bookToDelete)
        .then(result => {
            if (result.data.Status){
                toast.success('Book removed successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setAddBook((prevBooks) =>
                    prevBooks.filter((book) => book.id !== bookToDelete)
                );
                setShowModal(false);
            }
            else {
                alert(result.data.Error)
            }
        })
        .catch(error => {
            console.error('Error occurred while removing book:', error);
            alert('Failed to remove book. Please try again later.');
        });
    }

    const openModal = (id) => {
        setBookToDelete(id);
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className='flex font-poppins'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Library Management</h1>
                        <div className='relative'>
                            <div onClick={handleNotificationClick} className='cursor-pointer'>
                                <NotificationIcon count={notifications} />
                            </div>
                            {showNotifications && (
                                <div className='absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                                    <div className='p-4'>
                                        <h2 className='text-lg font-semibold mb-2'>Borrow Requests</h2>
                                        <div>
                                            {borrowRequests.length > 0 ? (
                                                <ul className='list-disc list-inside text-gray-600'>
                                                    {borrowRequests.map(request => (
                                                        <li key={request.id} className='mb-2 text-xs'>
                                                            <span className='font-semibold'>{request.studentName}</span> made a request for <span className='font-semibold'>{request.bookname}</span> on <strong>{formatDate(new Date(request.request_date).toLocaleDateString())}.</strong>
                                                            <div className='mt-2 flex space-x-2'>
                                                                <button className='px-1 py-1 bg-green-500 text-white hover:bg-green-700 rounded text-xs' onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                                                                <button className='px-1 py-1 bg-red-500 text-white hover:bg-red-700 rounded text-xs' onClick={() => handleRejectRequest(request.id)}>Decline</button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className='text-red-500 text-xs'>No request received.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <form className='mb-10'>
                        <h2 className='font-semibold mb-2'>Add New Book</h2>
                        <div className='mb-2.5'>
                            <label htmlFor='title' className='block mb-[5px]'>Title</label>
                            <input type='text' id='title' className='w-full p-2 text-base border border-gray-300 rounded-md' onChange={(e) => setLibrary({...library, bookname: e.target.value})}/>
                        </div>
                        <div className='mb-2.5'>
                            <label htmlFor='author' className='block mb-[5px]'>Author</label>
                            <input type='text' id='title' className='w-full p-2 text-base border border-gray-300 rounded-md' onChange={(e) => setLibrary({...library, author: e.target.value})}/>
                        </div>
                        <button type='submit' className='px-4 py-2 text-base bg-blue-500 text-white border-none rounded-md cursor-pointer hover:bg-blue-700 transition-colors duration-300' onClick={handleSubmit}>Add Book</button>
                    </form>

                    <h2 className='font-semibold mb-5'>Books Available</h2>
                    <table className='w-full border-gray-300'>
                        <thead className='bg-gray-200 text-left'>
                            <tr>
                                <th className='py-2 px-4 border-b '>Book Title</th>
                                <th className='py-2 px-4 border-b '>Author</th>
                                <th className='py-2 px-4 border-b '>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-left'>
                            {
                                addBook.map(addBook => (
                                    <tr key={addBook.id}>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addBook.bookname}</td>
                                        <td className='py-2 px-4 border-b font-poppins font-normal text-sm'>{addBook.author}</td>
                                        <td className='py-2 px-4 border-b'>
                                            <div className='relative'>
                                                <ToggleButton onToggle={() => handleToggle(addBook.id)} />
                                                <ul className={`absolute right-0 bg-gray-100 border border-gray-300 shadow-md rounded p-1 w-40 text-xs text-left overflow-hidden transition-all duration-500 ease-out ${toggleState[addBook.id] ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded transition-colors duration-300' onClick={() => openModal(addBook.id)}>Remove Book</li>
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
                        <p>Are you sure you want to remove this book?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-300 px-4 py-2 mr-2 rounded hover:bg-gray-400 transition-colors duration-300" onClick={closeModal}>Cancel</button>
                            <button className="bg-red-400 px-4 py-2 text-white rounded hover:bg-red-500 transition-colors duration-300" onClick={handleDelete}>Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Library
