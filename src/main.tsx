/* eslint-disable import/namespace */
import 'bootstrap';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//import App from './App.tsx';
import { LoginPage } from './Pages/loginPage.tsx';
import { BingocardcreatePage } from './Pages/bingocardcreatePage.tsx';
import { CardsPage } from './Pages/cardsPages.tsx';
import { UserPage } from './Pages/userPage.tsx';
import { App } from './App.tsx';
import { EditCardPage } from './Pages/editcardPage.tsx';
import { RankingPage } from './Pages/rankingPage.tsx';

import './index.scss';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '',
                element: <LoginPage />
            },
            {
                path: '/userPage',
                element: <UserPage />
            },
            {
                path: '/bingocardcreatePage',
                element: <BingocardcreatePage />
            },
            {
                path: '/cardPage',
                element: <CardsPage />
            },
            {
                path: '/editCard',
                element: <EditCardPage />
            },
            {
                path: '/rankingPage',
                element: <RankingPage />
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
