import { useEffect, useState } from 'react';
import httpClient from "../httpClient"

export const Content = () => {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get('http://localhost:3000/projects');
                if (resp.status !== 204) {
                    setProjects(resp.data);
                    console.log(resp.data);
                } else {
                    console.log('No projects found');
                }
            } catch (error) {
                console.log("Not authenticated");
            }
        })();
    }, []);

    return (
        <div className="content">
            {projects.map(project => (
                <li key={project.id}></li>
            ))}
        </div>
    );
}
