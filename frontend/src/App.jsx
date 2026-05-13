import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import CourseList   from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import StudyMode    from './pages/StudyMode';
import Tasks        from './pages/Tasks';
import Leaderboard  from './pages/Leaderboard';
import Profile      from './pages/Profile';

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
          <Route path="/courses"   element={<ProtectedRoute><AppShell><CourseList /></AppShell></ProtectedRoute>} />
          <Route path="/courses/:id" element={<ProtectedRoute><AppShell><CourseDetail /></AppShell></ProtectedRoute>} />
          <Route path="/study/:topicId" element={<ProtectedRoute><AppShell><StudyMode /></AppShell></ProtectedRoute>} />
          <Route path="/tasks"     element={<ProtectedRoute><AppShell><Tasks /></AppShell></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><AppShell><Leaderboard /></AppShell></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><AppShell><Profile /></AppShell></ProtectedRoute>} />
          <Route path="*"          element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
