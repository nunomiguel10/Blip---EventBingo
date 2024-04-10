import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

//import { auth } from './Firebase.ts';
import { Card } from './components/card/card.tsx';
import { NavBar } from './components/navbar/navbar.tsx';
//import './Firebase.ts';

import './App.scss';

// eslint-disable-next-line import/order
import { auth } from './Firebase.ts';

interface UserInfo {
    id: number;
    name: string;
    username: string;
    email: string;
}

export function App() {
    const [credits, setCredits] = useState(0);
    const [users, setUsers] = useState<UserInfo[]>([]);

    const incrementCredits = () => {
        setCredits(prevCredits => prevCredits + 1);
    };

    const decrementCredits = () => {
        if (credits > 0) {
            setCredits(prevCredits => prevCredits - 1);
        }
    };

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => setUsers(json));
    }, []);

    const handleGoogle = async () => {
        const provider = new GoogleAuthProvider();

        return signInWithPopup(auth, provider);
    };

    return (
        <>
            <NavBar credits={credits} />
            <div className="pt-36 w-full flex">
                <button onClick={handleGoogle} className="mx-auto border-4 bg-green-500">
                    Sign In With Google
                </button>
            </div>
            <div className="butoes mt-3 d-flex justify-content-center">
                <button type="button" className="btn btn-primary btn-sm me-2" onClick={incrementCredits}>
                    Adicionar crédito
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={decrementCredits}>
                    Remover crédito
                </button>
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    {users.map(user => (
                        <Card key={user.id} name={user.name} email={user.email} />
                    ))}
                </div>
            </div>
        </>
    );
}
