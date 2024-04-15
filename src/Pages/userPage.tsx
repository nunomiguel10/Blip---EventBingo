import { useEffect, useState } from 'react';

import { Card } from '../components/card/card';
import { NavBar } from '../components/navbar/navbar';

interface UserInfo {
    id: number;
    name: string;
    username: string;
    email: string;
}

export const UserPage = () => {
    const [users, setUsers] = useState<UserInfo[]>([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => setUsers(json));
    }, []);

    return (
        <>
            <NavBar />
            <div className="container">
                <div className="row justify-content-center">
                    {users.map(user => (
                        <Card key={user.id} name={user.name} email={user.email} />
                    ))}
                </div>
            </div>
        </>
    );
};
