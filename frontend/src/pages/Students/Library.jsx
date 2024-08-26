import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/LibraryStyles'
import axios from 'axios'
import NotificationIcon from '../../constants/NotificationIcon.jsx'
import { ToastContainer, toast } from 'react-toastify'

const StudentLibrary = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [notifications, setNotifications] = useState(0)
    const [showNotifications, setShowNotifications] = useState(false);
    const [borrowRequests, setBorrowRequests] = useState([]);

    const [addBook, setAddBook] = useState([])

    useEffect(() => {
        // Retrieve books from database
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
        axios.get('http://localhost:4000/student/borrow_requests')
            .then(result => {
                if (result.data.Status) {
                    setBorrowRequests(result.data.Requests);
                    setNotifications(result.data.Requests.length); // Set notifications count

                    // Update book statuses based on borrow requests
                    setAddBook(prevBooks => prevBooks.map(book => {
                        const matchingRequest = result.data.Requests.find(request => request.book_id === book.id);
                        if (matchingRequest) {
                            return { ...book, status: matchingRequest.status };
                        }
                        return book;
                    }));
                    
                } else {
                    console.error(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    }, [])

    const handleBorrow = (bookId) => {
        axios.post('http://localhost:4000/student/borrow_book', { book_id: bookId })
            .then(result => {
                if (result.data.Status) {
                    setNotifications(notifications + 1); // Increase the notification count
                    toast.success('Borrow request sent successfully!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setAddBook(prevBooks =>
                        prevBooks.map(book =>
                            book.id === bookId ? { ...book, status: 'Pending' } : book
                        )
                    );
                    // Update borrow requests list
                    setBorrowRequests([...borrowRequests, {
                        id: bookId,
                        bookname: addBook.find(book => book.id === bookId).bookname,
                        request_date: new Date().toISOString().split('T')[0],
                        status: 'Pending'
                    }]);
                } else {
                    toast.error(result.data.Error, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
            .catch(error => console.log(error));
    };

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className='flex font-poppins md:flex-col md:pl-0'>
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
                                <div className='absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                                    <div className='p-4'>
                                        <h2 className='text-lg font-semibold mb-2'>Borrow Requests</h2>
                                        <div>
                                            {borrowRequests.length > 0 ? (
                                                <ul className='list-disc list-inside text-gray-600'>
                                                    {borrowRequests.map(request => (
                                                        <li key={request.id} className='mb-2 text-xs'>
                                                            You made a request for <strong>{request.bookname}</strong> on <strong>{formatDate(new Date(request.request_date).toLocaleDateString())}.</strong>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className='text-red-500 text-xs'>You have not sent any request.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <ul className='list-none p-0'>
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
                                            <button className={`text-xs px-1 py-1 font-semibold rounded-md transition-colors duration-300 ${addBook.status === 'Pending' ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-700'}`} onClick={() => handleBorrow(addBook.id)} disabled={addBook.status === 'Pending'}>
                                                {addBook.status === 'Pending' ? 'Pending...' : 'Borrow'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    </ul>
                </div>
            </Content>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default StudentLibrary
