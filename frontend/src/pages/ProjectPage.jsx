import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Project } from '../components/Project';
import httpClient from "../httpClient"

const ProjectPage = () => {
    return (
        <div className='page project-page'>
            <Header />
            <Project />
        </div>
    );
}

export default ProjectPage;
