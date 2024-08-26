import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminRegister = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleRegister = () => {
        console.log("Admin Registered", {email, password})
    }

    return (
        <div className='flex flex-col font-poppins justify-center items-center bg-gradient-to-r from-[#ffffff] via-[#4facfe] via-[#00f2fe] via-[#43e97b] to-[#38f9d7] h-screen'>
            <h2 className='font-semibold text-3xl mb-3'>Admin Register</h2>
            <form className='flex flex-col items-center w-4/5 max-w-xs p-5 border border-gray-300 rounded-lg bg-[#f9f9f9] shadow-md'>
                <input id='email' type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full p-2.5 my-2.5 border border-gray-300 rounded-md'/>
                <div className='relative w-full'>
                    <input id='password' type={passwordVisible ? 'text' : 'password'} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full p-2.5 my-2.5 border border-gray-300 rounded-md'/>
                    <span id="togglePassword" onClick={togglePasswordVisibility} className=" absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                        {passwordVisible ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                    </span>
                </div>
                
                <button type='button' onClick={handleRegister} className='w-full p-3 mt-5 border-none rounded-lg bg-[#2F80ED] text-white text-lg text-center cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out md:text-base'>Register</button>
            </form>
        </div>
    )
}

export default AdminRegister
