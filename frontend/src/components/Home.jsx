import React, { useEffect, useState } from 'react'
import schoolhubLogo3 from '../assets/schoolhubLogo3.png'
import CustomWallpaper2 from '../assets/CustomWallpaper2.jpg'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    // Array of wise sayings about education
    const educationQuotes = [
        "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
        "The roots of education are bitter, but the fruit is sweet. - Aristotle",
        "An investment in knowledge pays the best interest. - Benjamin Franklin",
        "Education is the passport to the future, for tomorrow belongs to those who prepare for it today. - Malcolm X",
        "The purpose of education is to replace an empty mind with an open one. - Malcolm Forbes",
        "The whole purpose of education is to turn mirrors into windows. - Sydney J. Harris",
        "Education is not preparation for life; education is life itself. - John Dewey",
        "Education is not the filling of a pail, but the lighting of a fire. It is about awakening the mind, fostering creativity, and instilling a sense of responsibility and curiosity that enables individuals to explore the world and contribute positively to society. — William Butler Yeats",
        "The great aim of education is not knowledge but action. True education helps us to harness the power of our minds, to analyze, question, and apply the knowledge we gain, using it to make the world a better place for all. — Herbert Spencer",
        "Education is the key to unlocking the golden door of freedom. It opens up endless possibilities, allowing us to dream and aspire to heights we never thought possible, to understand others, and to find our place in the ever-changing landscape of the world. — George Washington Carver",
        "Education is the process through which the knowledge, skills, and values of a society are passed down from one generation to the next. It is the tool by which a society teaches its children how to think, create, and grow into responsible adults who contribute meaningfully. — Albert Einstein",
        "True education does not merely teach one to memorize facts, but to think critically, question deeply, and seek understanding. It encourages the individual to explore, to be curious, and to become a lifelong learner who constantly seeks to expand their horizons. — Martin Luther King Jr.",
        "The purpose of education is to replace an empty mind with an open one. It is to help us see the world through different perspectives, to cultivate empathy, and to inspire us to act with integrity and purpose in the face of life's challenges. — Sydney J. Harris",
        "Education is not a preparation for life; it is life itself. It is the path that leads to personal growth, self-discovery, and the ability to make informed decisions that benefit both ourselves and the communities in which we live. — John Dewey",
        "Education is the cornerstone of progress. It provides individuals with the tools they need to solve problems, adapt to change, and thrive in an increasingly complex world. It empowers us to make informed choices, foster innovation, and build a better future for all. — Nelson Mandela"
    ];

    // Randomly select a quote when the component is rendered
    const [selectedQuote, setSelectedQuote] = useState('');

    useEffect(() => {
        const randomQuote = educationQuotes[Math.floor(Math.random() * educationQuotes.length)];
        setSelectedQuote(randomQuote);
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    const handleLoginClick = () => {
        navigate('/choose-user')
    }

    return (
        <>
            <nav className='fixed top-0 left-0 w-full flex flex-col items-center justify-between p-5 bg-transparent text-black font-poppins z-[1000] md:flex-row md:p-2.5'>
                <img src={schoolhubLogo3} alt='logo' className='w-[50px] h-auto md:mb-2.5'/>   
                {/* <div className='flex items-center md:mt-2.5'>
                    <a href = "#" className='mr-5 text-gray-500 no-underline text-lg font-bold hover:underline md:mx-2.5 md:text-base'>About Us</a>
                    <a href = "#" className='mr-5 text-gray-500 no-underline text-lg font-bold hover:underline md:mx-2.5 md:text-base'>Contact Us</a>
                </div> */}
                <div className='flex items-center mr-[35px] md:mt-2.5 md:mr-0'>
                    <button onClick={handleLoginClick} className='bg-[#2c3e50] text-white border-none py-2 px-4 mr-2.5 cursor-pointer text-base font-bold rounded transform hover:scale-110 transition-transform duration-300 ease-in-out md:py-2 md:px-4 md:text-sm'>Sign In</button>
                    {/* <button className='text-white border-2 border-[#2c3e50] py-2 px-4 cursor-pointer text-base font-bold rounded bg-transparent transition duration-300 ease-in-out hover:bg-[#2c3e50] md:py-2 md:px-4 md:text-sm'>Guest Mode</button> */}
                </div>
            </nav>
            <div className='relative flex flex-col items-center text-center font-poppins bg-cover bg-center min-h-screen pt-20 md:pt-15'>
                <img src={CustomWallpaper2} alt='bg' className='absolute inset-0 w-full h-full object-cover'/>
                <div className='relative z-10 mt-5'>
                    <h1 href="App.css" className='text-4xl font-bold text-[#2c3e50] md:text-3xl sm:text-lg custom-text-shadow'>School Management System</h1>
                    <div className='max-w-[800px] mx-auto mt-3 text-base font-semibold text-[#2c3e50] text-justify px-5 md:text-sm md:px-4'>
                        <p> {selectedQuote} </p>
                    </div>
                    {/* <Link to="/admin-register" className='text-black text-xs font-bold no-underline mt-2 md:text-xs hover:underline'>Admin Register</Link> */}
                </div>
            </div>    
        </>
    )
}

export default Home
