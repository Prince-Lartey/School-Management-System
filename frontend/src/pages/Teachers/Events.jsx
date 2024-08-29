import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css'
import Sidebar from './Sidebar'
import { Content } from '../../styles/EventCalendarStyles'
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';

const TeacherEvents = () => {
    const [isOpen, setIsOpen] = useState(true);

    // Get the API URL from the environment variable
    const API_URL = import.meta.env.VITE_PROD_BASE_URL;

    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState({
        date: new Date(),
        title: '',
        description: ''
    });

    useEffect(() => {
        axios.get(`${API_URL}/auth/events`)
            .then(result => {
                if (result.data.Status) {
                    setEvents(result.data.Result);
                } else {
                    console.log(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate that all fields are filled
        if (!event.date || !event.title.trim() || !event.description.trim()) {
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

        axios.post(`${API_URL}/auth/add_event`, event)
            .then(result => {
                if (result.data.Status) {
                    toast.success('Event added successfully!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    console.log(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    };

    // Delete event
    const [showModal, setShowModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    const handleDelete = () => {
        
        axios.delete(`${API_URL}/auth/delete_event/` + eventToDelete)
        .then(result => {
            if (result.data.Status){
                toast.success('Event removed successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event.id !== eventToDelete)
                );
                setShowModal(false);
            }
            else {
                alert(result.data.Error)
            }
        })
        .catch(error => {
            console.error('Error occurred while removing event:', error);
            alert('Failed to remove event. Please try again later.');
        });
    }

    const openModal = (id) => {
        setEventToDelete(id);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };


    const formatDate = (dateString) => {
        return moment(dateString).format('DD-MM-YYYY')
    };

    return (
        <div className='flex font-poppins md:pl-0 md:flex-col'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
                <Content isOpen={isOpen}>
                    <div className='p-5'>
                        <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Events and Calender</h1>
                        <form className='mt-5 mb-10'>
                            <h2 className='font-semibold text-[#333333] mb-2'>Select Date</h2>
                            <DatePicker
                                selected={(event.date)}
                                onChange={(date) => setEvent({ ...event, date })}
                                className='mb-5 border-2 rounded p-2'
                                minDate={new Date()}
                            />
                            <h2 className='font-semibold text-[#333333] mb-2'>Add New Event</h2>
                            <input type='text' value={event.title} placeholder='Enter Event Title' className='flex-1 p-2 border border-gray-300 rounded-md mb-5' onChange={(e) => setEvent({ ...event, title: e.target.value })}/>
                            <input type='text' value={event.description} placeholder='Enter Event Details' className='flex-1 p-2 border border-gray-300 rounded-md w-full mb-5' onChange={(e) => setEvent({ ...event, description: e.target.value })}/>
                            <button type='submit' className='px-4 py-2 text-base bg-blue-500 text-white border-none rounded-md cursor-pointer hover:bg-blue-700 transition-colors duration-300' onClick={handleSubmit}>Add Event</button>
                        </form>
                        
                        <h2 className='mb-5 font-semibold text-[#333333]'>Events</h2>
                        <ul>
                            {events.map((event) => (
                                <li key={event.id} className='text-sm mb-4 flex justify-between border-b py-2'>
                                    <strong>{formatDate(event.date)}: </strong>{event.title} - {event.description}
                                    <button className='bg-red-400 text-white font-poppins font-semibold rounded p-1 text-xs hover:bg-red-500 ml-1' onClick={() => openModal(event.id)} >Delete</button>
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
                        <p>Are you sure you want to remove this event?</p>
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

export default TeacherEvents
