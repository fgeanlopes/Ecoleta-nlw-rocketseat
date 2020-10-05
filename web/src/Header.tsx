import React from 'react';

interface HeaderProps{
    title: string,
    numberSold: number
}

const Header: React.FC<HeaderProps> = (props) =>{
    return (
        <header>
            <h3>{props.title}</h3>
            <h1>Numero é {props.numberSold}</h1>
        </header>
    )
}

export default Header;