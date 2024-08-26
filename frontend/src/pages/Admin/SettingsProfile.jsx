import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Content } from '../../styles/SettingsProfileStyles'
import axios from 'axios'
import DatePicker from 'react-datepicker'

const SettingsProfile = () => {
    const [isOpen, setIsOpen] = useState(true)

    const [formData, setFormData] = useState({
        school_name: '',
        address: '',
        email: '',
        phone_number: '',
        start_date: null,
        end_date: null,
        language_preference: '',
        timezone: '',
        date_format: ''
    });
    const [logo, setLogo] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date, dateString, name) => {
        setFormData({ ...formData, [name]: dateString });
    };

    const handleFileChange = (e) => {
        setLogo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('school_name', formData.school_name);
        data.append('address', formData.address);
        data.append('email', formData.email);
        data.append('phone_number', formData.phone_number);
        data.append('start_date', formData.start_date);
        data.append('end_date', formData.end_date);
        data.append('date_format', formData.date_format);
        if (logo) {
            data.append('logo', logo);
        }

        try {
            const response = await axios.post('http://localhost:4000/auth/update_general_settings', data);
            console.log(response.data);
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    return (
        <div className='flex font-poppins md:pl-0 md:flex-col'>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>General Settings</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <div>
                            <label className='mr-2 '>School Name</label>
                            <input type="text" name="school_name" value={formData.school_name} onChange={handleInputChange} className="border border-gray-300 rounded p-1" />
                        </div>
                        <div>
                            <label className='mr-2 '>Logo</label>
                            <input type="file" name="logo" onChange={handleFileChange} className="border border-gray-300 rounded p-1" />
                        </div>
                        <div>
                            <label className='mr-2 '>Address</label>
                            <input name="address" value={formData.address} onChange={handleInputChange} className="border border-gray-300 rounded p-1" />
                        </div>
                        <div>
                            <label className='mr-2 '>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="border border-gray-300 rounded p-1" />
                        </div>
                        <div>
                            <label className='mr-2 '>Phone Number</label>
                            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="border border-gray-300 rounded p-1" />
                        </div>
                        <div>
                            <label className='mr-2 '>Start Date</label>
                            <DatePicker onChange={(date, dateString) => handleDateChange(date, dateString, 'start_date')}  className="border border-gray-300 rounded p-1"/>
                        </div>
                        <div>
                            <label className='mr-2 '>End Date</label>
                            <DatePicker onChange={(date, dateString) => handleDateChange(date, dateString, 'end_date')} className="border border-gray-300 rounded p-1"/>
                        </div>
                        <div>
                            <label className='mr-2 '>Date Format</label>
                            <select name="date_format" value={formData.date_format} onChange={handleInputChange} className="border border-gray-300 rounded p-1">
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                <option value="MMMM D, YYYY">MMMM D, YYYY</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white w-60 p-2 rounded hover:bg-blue-700 transition-colors duration-300">Update Settings</button>
                    </form>
                </div>
            </Content>
        </div>
    )
}

export default SettingsProfile
