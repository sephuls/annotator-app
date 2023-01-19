import { useEffect, useState, useRef } from 'react';
import { Timeline } from '../components/Timeline';
import httpClient from "../httpClient"
import ReactPlayer from 'react-player'


export function Project() {
    const playerRef = useRef(null);
    const [playerState, setPlayerState] = useState({
        played: 0,
        duration: 0,
        cursorPosition: {x: 394, y: 0}
    });

    const [projectId, setProjectId] = useState(1);
    const [project, setProject] = useState({});

    const [videoFilePath, setVideoFilePath] = useState(null);

    const handleVideoUpload = (event) => {
        setVideoFilePath(URL.createObjectURL(event.target.files[0]));
    };

    const handleSeekChange = (e) => {
        setPlayerState({
            ...playerState,
            played: parseFloat(e.target.value),
        })
    }

    const handleCursorChange = (e, data) => {
        setPlayerState({
            ...playerState,
            played: data.x * playerState.duration / 1440,
            cursorPosition: {x: data.x, y: 0}
        })
        playerRef.current.seekTo(data.x / 1440)
    }

    const handleDuration = (e) => {
        setPlayerState({
            ...playerState,
            duration: parseFloat(e)
        })
    }

    const handleProgress = state => {
        setPlayerState({
            ...playerState,
            played: parseFloat(state.playedSeconds),
            cursorPosition: {
                x: state.played * 1440,
                y: 0
            }
        })
    }

    const handleExport = async (e) => {
        try {
            httpClient.get(`http://localhost:5000/export/${projectId}`)
            .then(resp => {
                // window.location.reload(false);
                console.log('export', resp.data);
            })
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleDisplay = async (e, videoStream) => {
        setVideoFilePath(`../../${videoStream.file_path.slice(22)}`);
    };

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
            <div className='display'>
                <div className='display-side-left'>
                    <input type="file" onChange={handleVideoUpload} />
                        <p>Played: {playerState.played} Duration: {playerState.duration} Position: {playerState.cursorPosition.x}</p>
                        <form action={`http://localhost:5000/export/${projectId}`}>
                            <input type="submit" value="Export" />
                        </form>
                </div>

                <div className='video-player'>
                    <ReactPlayer
                        ref={playerRef}
                        url={videoFilePath}
                        // url={'06-V1-declarative-M.mp4'}
                        controls={true}
                        onSeek={handleSeekChange}
                        onDuration={handleDuration}
                        onProgress={handleProgress}
                    />
                </div>

                <div className='display-side-right'></div>


            </div>

            <Timeline
                projectId={projectId}
                startIndex={project.start_index}
                endIndex={project.end_index}
                cursorPosition={playerState.cursorPosition}
                handleCursorChange={handleCursorChange}
                handleDisplay={handleDisplay}
            />
        </div>
    );
}
