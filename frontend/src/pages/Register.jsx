// Register is handled in Login.jsx via tabs - redirect there
import { Navigate } from 'react-router-dom';
export default function Register() { return <Navigate to="/login" replace />; }
