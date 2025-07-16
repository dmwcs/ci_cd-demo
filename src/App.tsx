import { Navigate, Route, Routes } from 'react-router';
import Login from './app/Login';
import PumpList from './app/PumpPage';
import PumpDetail from './app/PumpDetail';
import Navbar from './app/components/Navbar';
import ProtectedRoute from './app/components/ProtectedRouter';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route path='/pump' element={<ProtectedRoute />}>
          <Route index element={<PumpList />} />
          <Route path=':id' element={<PumpDetail />} />
        </Route>

        <Route path='*' element={<Navigate to='/pump' replace />} />
      </Routes>
    </>
  );
}

export default App;
