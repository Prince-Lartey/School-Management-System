import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import ChooseUser from "./components/ChooseUser"
import AdminRegister from "./components/AdminRegister"
import AdminSignin from "./components/AdminSignin"
import StudentSignin from "./components/StudentSignin"
import TeacherSignin from "./components/TeacherSignin"

import AdminDashboard from "./pages/Admin/Dashboard"
import Announcement from "./pages/Admin/Announcement"
import Assignment from "./pages/Admin/Assignment"
import Attendance from "./pages/Admin/Attendance"
import Grades from "./pages/Admin/Grades"
import Library from "./pages/Admin/Library"
import Performance from "./pages/Admin/Performance"
// import SettingsProfile from "./pages/Admin/SettingsProfile"
import Sidebar from "./pages/Admin/Sidebar"
import Students from "./pages/Admin/Students"
import Teachers from "./pages/Admin/Teachers"
import EventCalendar from "./pages/Admin/EventCalendar"
import Subject from "./pages/Admin/Subject"
import CreateExams from "./pages/Admin/CreateExams"
import ExamResults from "./pages/Admin/ExamResults"
import AttendanceSummary from "./pages/Admin/AttendanceSummary"

import StudentDashboard from "./pages/Students/StudentDashboard"
import StudentAssignment from "./pages/Students/Assignment"
import StudentAttendance from "./pages/Students/Attendance"
import StudentExams from "./pages/Students/Exams"
import StudentLibrary from "./pages/Students/Library"
import StudentPerformance from "./pages/Students/Performance"
import StudentProfile from "./pages/Students/Profile"
import StudentAnnouncement from "./pages/Students/Announcement"

import TeacherDashboard from "./pages/Teachers/Dashboard"
import TeacherAnnouncement from "./pages/Teachers/Announcement"
import TeacherAssignment from "./pages/Teachers/Assignment"
import TeacherAttendance from "./pages/Teachers/Attendance"
import TeacherGrades from "./pages/Teachers/Grades"
import TeacherEvents from "./pages/Teachers/Events"
import TeacherExams from "./pages/Teachers/Exams"
import TeacherPerformance from "./pages/Teachers/Performance"
import TeacherProfile from "./pages/Teachers/Profile"
import TeacherSidebar from "./pages/Teachers/Sidebar"
import TeacherStudents from "./pages/Teachers/Students"
import TeacherTeachers from "./pages/Teachers/Teachers"
import PrivateRoute from "./constants/PrivateRoute"
import TeacherSubject from "./pages/Teachers/Subject"
import TeacherAttendanceSummary from "./pages/Teachers/AttendanceSummary"
import ExamReport from "./pages/Admin/ExamReport"
import TeacherExamReport from "./pages/Teachers/TeacherExamReport"




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/choose-user" element={<ChooseUser/>}/>
        <Route path="/admin-register" element={<AdminRegister/>}/>
      </Routes>

      <Routes>
        {/* Sign In routes */}
        <Route path="/admin-signin" element={<AdminSignin/>}/>
        <Route path="/student-signin" element={<StudentSignin/>}/>
        <Route path="/teacher-signin" element={<TeacherSignin/>}/>
      </Routes>

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute>
            <AdminDashboard/>
          </PrivateRoute>}
        />
        <Route path="/admin/announcements" element={
          <PrivateRoute>
            <Announcement/>
          </PrivateRoute>}
        />
        <Route path="/admin/assignment" element={
          <PrivateRoute>
            <Assignment/>
          </PrivateRoute>}
        />
        <Route path="/admin/attendance/add" element={
          <PrivateRoute>
            <Attendance/>
          </PrivateRoute>}
        />
        <Route path="/admin/attendance/summary" element={
          <PrivateRoute>
            <AttendanceSummary/>
          </PrivateRoute>}
        />
        <Route path="/admin/grades" element={
          <PrivateRoute>
            <Grades/>
          </PrivateRoute>}
        />
        <Route path="/admin/eventcalendar" element={
          <PrivateRoute>
            <EventCalendar/>
          </PrivateRoute>}
        />
        <Route path="/admin/exams/create" element={
          <PrivateRoute>
            <CreateExams />
          </PrivateRoute>}
        />
        <Route path="/admin/exams/results" element={
          <PrivateRoute>
            <ExamResults />
          </PrivateRoute>}
        />
        <Route path="/admin/exams/reports" element={
          <PrivateRoute>
            <ExamReport />
          </PrivateRoute>}
        />
        <Route path="/admin/library" element={
          <PrivateRoute>
            <Library/>
          </PrivateRoute>}
        />
        <Route path="/admin/performance" element={
          <PrivateRoute>
            <Performance/>
          </PrivateRoute>}
        />
        {/* <Route path="/admin/settingsprofile" element={
          <PrivateRoute>
            <SettingsProfile/>
          </PrivateRoute>}
        /> */}
        <Route path="/admin/sidebar" element={
          <PrivateRoute>
            <Sidebar/>
          </PrivateRoute>}
        />
        <Route path="/admin/students" element={
          <PrivateRoute>
            <Students/>
          </PrivateRoute>}
        />
        <Route path="/admin/teachers" element={
          <PrivateRoute>
            <Teachers/>
          </PrivateRoute>}
        />
        <Route path="/admin/subjects" element={
          <PrivateRoute>
            <Subject/>
          </PrivateRoute>}
        />
      </Routes>

      <Routes>
        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <PrivateRoute>
            <StudentDashboard/>
          </PrivateRoute>}
        />
        <Route path="/student/announcements" element={
          <PrivateRoute>
            <StudentAnnouncement/>
          </PrivateRoute>}
        />
        <Route path="/student/assignment" element={
          <PrivateRoute>
            <StudentAssignment/>
          </PrivateRoute>}
        />
        <Route path="/student/attendance/summary" element={
          <PrivateRoute>
            <StudentAttendance/>
          </PrivateRoute>}
        />
        <Route path="/student/exams/results" element={
          <PrivateRoute>
            <StudentExams/>
          </PrivateRoute>}
        />
        <Route path="/student/library" element={
          <PrivateRoute>
            <StudentLibrary/>
          </PrivateRoute>}
        />
        <Route path="/student/performance" element={
          <PrivateRoute>
            <StudentPerformance/>
          </PrivateRoute>}
        />
        <Route path="/student/profile" element={
          <PrivateRoute>
            <StudentProfile/>
          </PrivateRoute>}
        />
        <Route path="/student/sidebar" element={
          <PrivateRoute>
            <Sidebar/>
          </PrivateRoute>}
        />
      </Routes>
      
      <Routes>
        {/* Teachers Routes */}
        <Route path="/teacher/dashboard" element={
          <PrivateRoute>
            <TeacherDashboard/>
          </PrivateRoute>}
        />
        <Route path="/teacher/announcements" element={
          <PrivateRoute>
            <TeacherAnnouncement/>
          </PrivateRoute>}
        />
        <Route path="/teacher/assignment" element={
          <PrivateRoute>
            <TeacherAssignment/>
          </PrivateRoute>}
        />
        <Route path="/teacher/attendance/add" element={
          <PrivateRoute>
            <TeacherAttendance/>
          </PrivateRoute>}
        />
        <Route path="/teacher/attendance/summary" element={
          <PrivateRoute>
            <TeacherAttendanceSummary/>
          </PrivateRoute>}
        />
        <Route path="/teacher/grades" element={
          <PrivateRoute>
            <TeacherGrades/>
          </PrivateRoute>}
        />
        <Route path="/teacher/eventcalendar" element={
          <PrivateRoute>
            <TeacherEvents/>
          </PrivateRoute>}
        />
        <Route path="/teacher/exams/results" element={
          <PrivateRoute>
            <TeacherExams />
          </PrivateRoute>}
        />
        <Route path="/teacher/exams/reports" element={
          <PrivateRoute>
            <TeacherExamReport />
          </PrivateRoute>}
        />
        <Route path="/teacher/performance" element={
          <PrivateRoute>
            <TeacherPerformance/>
          </PrivateRoute>}
        />
        <Route path="/teacher/profile" element={
          <PrivateRoute>
            <TeacherProfile/>
          </PrivateRoute>}
        />
        <Route path="/teacher/sidebar" element={
          <PrivateRoute>
            <TeacherSidebar/>
          </PrivateRoute>}
        />
        <Route path="/teacher/students" element={
          <PrivateRoute>
            <TeacherStudents/>
          </PrivateRoute>}
        />
        <Route path="/teacher/teachers" element={
          <PrivateRoute>
            <TeacherTeachers/>
          </PrivateRoute>}
        />
        <Route path="/teacher/subjects" element={
          <PrivateRoute>
            <TeacherSubject/>
          </PrivateRoute>} 
        />
      </Routes>
    </Router>
  )
}

export default App
