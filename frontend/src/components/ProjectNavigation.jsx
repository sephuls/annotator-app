import { useEffect, useState } from 'react';
import httpClient from "../httpClient"

export const ProjectNavigation = () => {
    const [projects, setProjects] = useState([])
    const [newProjectName, setNewProjectName] = useState("")

    const handleSubmit = async () => {
        console.log(newProjectName)
        const resp = await httpClient.post(`//localhost:5000/project/${newProjectName}/add`);
    };

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get('http://localhost:5000/projects');
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
        <div className="project-nav">
            <h1>UserHomePage</h1>
            <form>
                <label>Create a new project:</label>
                <input
                    type='text'
                    value={newProjectName}
                    onChange={(e) => {setNewProjectName(e.target.value)}}
                    required
                />
                <button type="button" onClick={() => handleSubmit()}>Submit</button>
            </form>

            List of current projects:
            {projects.map(project => (
                <li key={project.id}>
                    {JSON.stringify(project)}
                </li>
            ))}
        </div>
    );
}
