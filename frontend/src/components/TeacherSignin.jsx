import axios from 'axios';
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import schoolhubLogo3 from '../assets/schoolhubLogo3.png'

const TeacherSignin = () => {
    const navigate = useNavigate()

    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState(null)

    axios.defaults.withCredentials = true

    const handleSignIn = (event) => {
        event.preventDefault()
        axios.post('http://localhost:4000/teacher/teacherLogin', values)
        .then(result => {
            if (result.data.loginStatus) {
                localStorage.setItem('valid', true)
                navigate('/teacher/dashboard')
            }
            else {
                setError(result.data.Error)
            }
        })
        .catch(error => console.log(error))
    }

    // Make password visible
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className='relative flex flex-col font-poppins justify-center items-center bg-gradient-to-r from-[#ffffff] via-[#dfe6e9] via-[#b2bec3] via-[#636e72] to-[#2c3e50] h-screen'>
            <div className='absolute top-0 left-0 p-2.5'>
                <img src={schoolhubLogo3} alt='logo' className='w-[50px] h-auto md:mb-2.5'/>
            </div>
            <h2 className='font-semibold text-3xl mb-3'>Teacher Sign In</h2>
            <form className='flex flex-col items-center w-4/5 max-w-xs p-5 border border-gray-300 rounded-lg bg-[#f9f9f9] shadow-md'>
                <div className='font-poppins text-red-500 font-semibold'>
                    {error && error}
                </div>
                <input id='email' type='email' placeholder='Enter your email' name='email' onChange={(e) => setValues({...values, email: e.target.value})} required className='w-full p-2.5 my-2.5 border border-gray-300 rounded-md'/>
                <div className='relative w-full'>
                    <input id='password' name='password' type={passwordVisible ? 'text' : 'password'} placeholder='Enter your password' onChange={(e) => setValues({...values, password: e.target.value})} required className='w-full p-2.5 my-2.5 border border-gray-300 rounded-md'/>
                    <span id="togglePassword" onClick={togglePasswordVisibility} className=" absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                        {passwordVisible ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                    </span>
                </div>
                
                <button to="/teacher/dashboard" type='button' onClick={handleSignIn} className='w-full p-3 mt-5 border-none rounded-lg bg-[#636e72] text-white text-lg text-center cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out md:text-base'>Sign In</button>
            </form>
        </div>
    )
}

export default TeacherSignin
