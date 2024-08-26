import React from 'react'
import { Link } from 'react-router-dom'
import CustomWallpaper3 from '../assets/CustomWallpaper3.jpg'
import schoolhubLogo3 from '../assets/schoolhubLogo3.png'

const ChooseUser = () => {
    return (
        <div className='relative font-poppins justify-start items-center h-screen bg-white '>
            <img src={CustomWallpaper3} alt='bg' className='absolute inset-0 w-full h-full object-cover'/>
            <div className='flex flex-col relative p-2.5'>
                <div>
                    <img src={schoolhubLogo3} alt='logo' className='w-[50px] h-auto md:mb-2.5'/>
                </div> 
                <div className='relative flex flex-col justify-center md:flex-row md:justify-center md:items-start p-10'>
                    <div className='text-center pt-5 md:pt-0 md:m-5 md:text-left'>
                        <h2 className='text-2xl font-bold mb-5 text-gray-500 md:text-xl'>Admin</h2>
                        <Link to="/admin-signin" className='bg-gray-500 text-white border-none py-2 px-4 mt-2 no-underline cursor-pointer rounded-md transition-colors duration-300 ease-in-out hover:bg-[#2c3e50] md:py-2 md:px-4 md:text-sm'>Login as Admin</Link>
                    </div>

                    <div className='text-center pt-5 md:pt-0 md:m-5 md:text-left'>
                        <h2 className='text-2xl font-bold mb-5 text-gray-500 md:text-xl'>Student</h2>
                        <Link to="/student-signin" className='bg-gray-500 text-white border-none py-2 px-4 mt-2 no-underline cursor-pointer rounded-md transition-colors duration-300 ease-in-out hover:bg-[#2c3e50] md:py-2 md:px-4 md:text-sm'>Login as Student</Link>
                    </div>

                    <div className='text-center pt-5 md:pt-0 md:m-5 md:text-left'>
                        <h2 className='text-2xl font-bold mb-5 text-gray-500 md:text-xl'>Teacher</h2>
                        <Link to="/teacher-signin" className='bg-gray-500 text-white border-none py-2 px-4 mt-2 no-underline cursor-pointer rounded-md transition-colors duration-300 ease-in-out hover:bg-[#2c3e50] md:py-2 md:px-4 md:text-sm'>Login as Teacher</Link>
                    </div>  
                </div> 
                
            </div>
            
        </div>
    )
}

export default ChooseUser
