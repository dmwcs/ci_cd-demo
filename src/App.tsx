import { Route, Routes } from 'react-router';
import Login from './app/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
    </Routes>
  );
}

export default App;
