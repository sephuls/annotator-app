import { useEffect, useState } from 'react';
import { Timeline } from '../components/Timeline';
import httpClient from "../httpClient"
import ReactPlayer from 'react-player'


export function Project({projectId}) {
    state = {
        played: 0
    }

    const [project, setProject] = useState({});
    const [videoFilePath, setVideoFilePath] = useState(null);

    const handleVideoUpload = (event) => {
        setVideoFilePath(URL.createObjectURL(event.target.files[0]));
    };

    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get(`http://localhost:5000/project/${projectId}`);
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
            <div className='video-player'>
                <ReactPlayer
                    url={videoFilePath}
                    controls={true}
                    ref={this.getCurrentTime()}
                />
            </div>
            <input type="file" onChange={handleVideoUpload} />
            {/* <h1>ProjectPage</h1>
            Current project: {JSON.stringify(project)} */}
            <Timeline projectId={projectId} startIndex={project.start_index} endIndex={project.end_index}/>
        </div>
    );
}
