import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Login    from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents  from "./pages/admin/Students";
import AdminTeachers  from "./pages/admin/Teachers";
import AdminCourses   from "./pages/admin/Courses";

import TeacherDashboard   from "./pages/teacher/Dashboard";
import TeacherAttendance  from "./pages/teacher/Attendance";
import TeacherMarks       from "./pages/teacher/Marks";
import TeacherAssignments from "./pages/teacher/Assignments";

import StudentProfile     from "./pages/student/Profile";
import StudentMarks       from "./pages/student/Marks";
import StudentAttendance  from "./pages/student/Attendance";
import StudentAssignments from "./pages/student/Assignments";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"         element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students"  element={<AdminStudents />} />
          <Route path="/admin/teachers"  element={<AdminTeachers />} />
          <Route path="/admin/courses"   element={<AdminCourses />} />
        </Route>

        {/* Teacher only */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/teacher/dashboard"   element={<TeacherDashboard />} />
          <Route path="/teacher/attendance"  element={<TeacherAttendance />} />
          <Route path="/teacher/marks"       element={<TeacherMarks />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        </Route>

        {/* Student only */}
        <Route element={<ProtectedRoute allowedRoles={["student"]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/student/profile"     element={<StudentProfile />} />
          <Route path="/student/marks"       element={<StudentMarks />} />
          <Route path="/student/attendance"  element={<StudentAttendance />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
