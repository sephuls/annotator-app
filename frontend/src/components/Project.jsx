import { useEffect, useState } from 'react';
import { Timeline } from '../components/Timeline';
import httpClient from "../httpClient"


export function Project({projectId}) {
    const [project, setProject] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.post(`http://localhost:5000/project/${projectId}`);
                if (resp.status !== 204) {
                    setProject(resp.data);
                    console.log(resp.data);
                } else {
                    console.log('Project not found');
                }
            } catch (error) {
                console.log("Not authenticated");
            }
        })();
    }, []);

    return (
        <div className="content">
            <h1>ProjectPage</h1>
            Current project: {JSON.stringify(project)}
            <Timeline projectId={projectId}/>
        </div>
    );
}
