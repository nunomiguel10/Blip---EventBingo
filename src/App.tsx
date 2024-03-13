import { useEffect, useState } from 'react';

import { Card } from './components/card/card.tsx';
import { NavBar } from './components/navbar/navbar.tsx';
import './Firebase.ts';

import './App.scss';

interface UserInfo {
    id: number;
    name: string;
    username: string;
    email: string;
}

export function App() {
    const [users, setUsers] = useState<UserInfo[]>([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => setUsers(json));
    }, []);

    console.log(users);

    return (
        <>
            <NavBar />
            <div className="container ">
                <div className="row justify-content-center">
                    {users.map(user => {
                        return <Card key={user.id} name={user.name} email={user.email} />;
                    })}
                </div>
            </div>
        </>
    );
}
