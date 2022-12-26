import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Project } from '../components/Project';
import httpClient from "../httpClient"

const ProjectPage = ({projectId}) => {
    return (
        <div className='page project-page'>
            <Header />
            <Project projectId={projectId}/>
        </div>
    );
}

export default ProjectPage;
