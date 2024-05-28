import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { NavBar } from './components/navbar/navbar.tsx';
import './Firebase.ts';

import './App.scss';

export function App() {
    return (
        <>
            {/* <NavBar credits={0} /> */}
            <Outlet></Outlet>
            <ToastContainer />
        </>
    );
}
