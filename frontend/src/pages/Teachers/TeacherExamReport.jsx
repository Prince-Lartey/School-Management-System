import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import { Content } from '../../styles/ExamStyles'
import axios from 'axios';
import schoolhubLogo3 from "../../assets/schoolhubLogo3.png"

const TeacherExamReport = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [report, setReport] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        // Fetch all students
        axios.get('http://localhost:4000/auth/students')
            .then(response => {
                if (response.data.Status) {
                    setStudents(response.data.Students);
                }
            })
            .catch(error => console.error('Error fetching students:', error));
    }, []);

    const handleStudentChange = (e) => {
        const regNumber = e.target.value;
        setSelectedStudent(regNumber);

        // Fetch exam report for selected student
        axios.get(`http://localhost:4000/auth/exam-report/${regNumber}`)
            .then(response => {
                if (response.data.Status) {
                    setReport(response.data.Report);
                }
            })
            .catch(error => console.error('Error fetching report:', error));
    };

    const printReport = () => {
        const reportContent = document.getElementById('report-card').innerHTML;
        const printWindow = window.open('', '', 'height=800,width=600');
    
        printWindow.document.write('<html><head><title>Report Card</title>');
        printWindow.document.write('<style>');
    
        // Basic Body Styling
        printWindow.document.write('body { font-family: "Poppins", sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; color: #333; }');
        
        // Container Styling
        printWindow.document.write('.border { border: 1px solid #ddd; padding: 20px; }');
        printWindow.document.write('.rounded-lg { border-radius: 8px; }');
        printWindow.document.write('.shadow-lg { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }');
        
        // Header Styling
        printWindow.document.write('.bg-blue-100 { background-color: #ebf8ff; padding: 20px; margin-bottom: 20px; }');
        printWindow.document.write('.flex { display: flex; align-items: center; }');
        printWindow.document.write('.text-5xl { font-size: 2.5em; margin: 0; }');
        printWindow.document.write('.font-semibold { font-weight: 600; }');
        
        // Table Styling
        printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }');
        printWindow.document.write('th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }');
        printWindow.document.write('th { background-color: #1f2937; color: white; font-weight: 600; }'); // Darker header background
        printWindow.document.write('tbody tr:nth-child(even) { background-color: #f9fafb; }'); // Zebra striping for rows
        
        // Footer Styling
        printWindow.document.write('.bg-blue-300 { background-color: #e2e8f0; padding: 10px; text-align: left; font-size: 0.9em; }');
        
        // Image Styling
        printWindow.document.write('img { max-width: 100px; height: auto; display: block; margin-right: 20px; }');
        
        // Comment Box Styling
        printWindow.document.write('textarea { width: 100%; height: 150px; padding: 10px; font-size: 1em; border: 1px solid #ddd; border-radius: 5px; }');
    
        // Additional Styling
        printWindow.document.write('.text-center { text-align: center; }');
        printWindow.document.write('.mb-10 { margin-bottom: 2.5rem; }');
        printWindow.document.write('.p-10 { padding: 2.5rem; }');
        printWindow.document.write('.gap-5 { gap: 1.25rem; }');
        
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(reportContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };
    
    
    
    return (
        <div className="flex md:flex-col md:pl-0 font-poppins">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <Content isOpen={isOpen}>
                <div className='p-5'>
                    <h1 className='text-2xl mb-5 font-semibold text-[#333333]'>Exam Report</h1>
                    <div className='mb-10'>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Student:</label>
                        <select 
                            value={selectedStudent} 
                            onChange={handleStudentChange}
                            className="block p-2 mb-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">-- Select a Student --</option>
                            {students.map(student => (
                                <option key={student.registrationNumber} value={student.registrationNumber}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {report.length > 0 && (
                        <div className="border rounded-lg shadow-lg" id="report-card">
                            <div className='flex mt-10 mb-10 bg-blue-100 p-10 '>
                                <img src={schoolhubLogo3} alt="logo" className='w-[100px] h-auto mr-5' />
                                <div className='flex flex-col justify-center'>
                                    <h1 className='text-5xl font-semibold'>REPORT CARD</h1>
                                    <p className=''>Sanctuary High School</p>
                                </div>
                            </div>
                            <div className='p-10'>
                                <div className='flex gap-5 justify-between'>
                                    <p><strong>Name :</strong> {report[0].studentName}</p>
                                    <p><strong>Grade :</strong> {report[0].grades}</p>
                                    <p><strong>Reg Number :</strong> {report[0].registrationNumber}</p>
                                    {/* <p><strong>Position :</strong> N/A</p> */}
                                </div>

                                <table className="min-w-full bg-white mt-4 mb-10 border-2 border-blue-300">
                                    <thead className='bg-blue-300'>
                                        <tr>
                                            <th className="py-2 px-4  text-white font-normal">Subjects</th>
                                            <th className="py-2 px-4  text-white font-normal">Score/Marks</th>
                                            <th className="py-2 px-4  text-white font-normal">Grade</th>
                                            <th className="py-2 px-4  text-white font-normal">Remarks/Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center '>
                                        {report.map((subject, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4 border-2 border-r border-blue-300">{subject.subjectName}</td>
                                                <td className="py-2 px-4 border-2 border-r border-blue-300">{subject.marks}</td>
                                                <td className="py-2 px-4 border-2 border-r border-blue-300">{subject.grade}</td>
                                                <td className="py-2 px-4 border-2 border-blue-300">{subject.remarks}</td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td className="py-2 px-4 font-bold border-blue-300">Total Score : </td>
                                            <td className="py-2 px-4 font-bold border-blue-300">
                                                {/* Calculate total marks */}
                                                {report.reduce((total, subject) => total + subject.marks, 0)}
                                            </td>
                                        </tr>           
                                    </tbody>
                                </table>

                                <div className='font-semibold bg-blue-300 text-white p-2 mb-10'>
                                    <p className='mb-5'>GRADING SCALE : A = 80%-100% | B = 70%-79% | C = 60%-69% | D = 50%-59% | F = 0%-49%</p>
                                    <p>REMARK SCALE : A = Excellent | B = Very Good | C = Good | D = Okay | F = Poor</p>
                                </div>

                                <div className="">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comment:</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="block w-full p-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}
                    <button onClick={printReport} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"> Print Report </button>
                </div>
            </Content>
        </div>
    );
};

export default TeacherExamReport;

