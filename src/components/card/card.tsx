/* eslint-disable jsx-a11y/anchor-is-valid */

import './card.scss';

interface CardProps {
    name: string;
    email: string;
}

export const Card = ({ name, email }: CardProps) => {
    return (
        <div className="card card-spacing card-size">
            <img
                src="https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg"
                className="card-img-top"
                alt="..."
            />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{email}</p>
                <a href="#" className="btn btn-primary">
                    Go somewhere
                </a>
            </div>
        </div>
    );
};
