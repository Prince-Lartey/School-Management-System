import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/AnnouncementStyles'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

const Announcement = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [message, setMessage] = useState('')
    const [announcement, setAnnouncement] = useState([])

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!message.trim()) {
            toast.error('Message is required!', {
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

        axios.post(`${API_URL}/auth/add_announcement`, { message })
        .then(result => {
            if (result.data.Status) {
                toast.success('Announcement posted successfully!', {
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
        axios.get(`${API_URL}/auth/announcement`)
        .then(result => {
            if(result.data.Status) {
                setAnnouncement(result.data.Result)
            } else {
                alert(result.data.Error) 
            }
        })
        .catch(error => console.log(error))
    }, [])

    // Delete announcement
    const [showModal, setShowModal] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);

    const handleDelete = () => {
        
        axios.delete(`${API_URL}/auth/delete_announcement/` + announcementToDelete)
        .then(result => {
            if (result.data.Status){
                toast.success('announcement removed successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setAnnouncement((prevAnnouncements) =>
                    prevAnnouncements.filter((announcement) => announcement.id !== announcementToDelete)
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
        setAnnouncementToDelete(id);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className='flex font-poppins md:pl-0 md:flex-col'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Announcement</h1>
                    <form className='mb-10'>
                        <div className='mb-2.5'>
                            <label htmlFor='announcement' className='block mb-[5px]'>Message: </label>
                            <textarea required rows={4} cols={20} className='w-full p-2 text-base border border-gray-300 rounded-md' onChange={(e) => setMessage(e.target.value)}></textarea>
                        </div>
                        <button type='submit' className='px-4 py-2 text-base bg-blue-500 text-white border-none rounded-md cursor-pointer hover:bg-blue-700 transition-colors duration-300' onClick={handleSubmit}>Send Announcement</button>
                    </form>

                    <h2 className='mb-5 font-semibold'>Announcements</h2>
                    <ul className='list-none p-0'>
                        {announcement.map(announcement => (
                            <li key={announcement.id} className='mb-4 flex justify-between items-center border-b py-2'>
                                <span className='text-sm mr-2'>{announcement.message}</span>
                                <button className='bg-red-400 text-white font-poppins font-semibold rounded p-1 text-xs hover:bg-red-500 transition-colors duration-300' onClick={() => openModal(announcement.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </Content>
            <ToastContainer position="top-right" />

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-md w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to remove announcement?</p>
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

export default Announcement
