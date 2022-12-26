import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { ProjectNavigation } from '../components/ProjectNavigation';
import httpClient from "../httpClient"

const UserHomePage = () => {
    return (
        <div className='page user-homepage'>
            <Header />
            <ProjectNavigation />
        </div>
    );
}

export default UserHomePage;
