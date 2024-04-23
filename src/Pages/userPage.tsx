import { useEffect, useState } from 'react';

import { BingocardcreatePage } from './bingocardcreatePage';

import { Card } from '../components/card/card';
import { NavBar } from '../components/navbar/navbar';

import './userPage.scss';

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

    const handleClick = () => {
        return <BingocardcreatePage />;
    };

    return (
        <>
            <NavBar />
            <div className="container_user_page">
                <div>
                    <button className="button_userpage" onClick={handleClick}>
                        Adicionar cartão
                    </button>
                </div>
                <div className="row justify-content-center">
                    {users.map(user => (
                        <Card key={user.id} name={user.name} email={user.email} />
                    ))}
                </div>
            </div>
        </>
    );
};
