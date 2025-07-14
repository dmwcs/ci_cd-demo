import { Navigate, Route, Routes } from 'react-router';
import Login from './app/Login';
import PumpList from './app/PumpPage';
import Navbar from './app/components/Navbar';
import ProtectedRoute from './app/components/ProtectedRouter';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route path='/pump' element={<ProtectedRoute />}>
          <Route index element={<PumpList />} />
        </Route>

        <Route path='*' element={<Navigate to='/pump' replace />} />
      </Routes>
    </>
  );
}

export default App;
