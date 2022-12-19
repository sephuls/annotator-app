import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Content } from '../components/Content';
import httpClient from "../httpClient"

const UserHomePage = () => {
    return (
        <div className='app user-homepage'>
            <Header />
            <Content />
        </div>
    );
}

export default UserHomePage;
