import { useEffect, useState, useRef } from 'react';
import { Timeline } from '../components/Timeline';
import httpClient from "../httpClient"
import ReactPlayer from 'react-player'
import useLocalStorage from "use-local-storage";


export function Project() {
    const projectId = 1;
    const [project, setProject] = useState({});
    const [videoFilePath, setVideoFilePath] = useLocalStorage(
        'videoFilePath', {}
    );
    const playerRef = useRef(null);
    const [playerState, setPlayerState] = useLocalStorage(
        'playerState',
        {
            played: 0,
            duration: 0,
            cursorPosition: {x: 394, y: 0}
        }
    );

    useEffect(() => {
        playerRef.current.seekTo((playerState.cursorPosition.x - 394) / 1040)
    });

    const handleVideoUpload = (event) => {
        setVideoFilePath(URL.createObjectURL(event.target.files[0]));
    };

    const handleSeekChange = (e) => {
        setPlayerState({
            ...playerState,
            // played: parseFloat(e.target.value),
        })
    }

    const handleCursorChange = (e, data) => {
        setPlayerState({
            ...playerState,
            played: (data.x - 394) * playerState.duration / 1040,
            cursorPosition: {x: data.x, y: 0}
        })
        playerRef.current.seekTo((data.x - 394) / 1040)
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
                x: 394 + state.played * 1040,
                y: 0
            }
        })
    }

    const handleExport = async (e) => {
        try {
            httpClient.get(`http://localhost:5000/export/${projectId}`)
            .then(resp => {
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

                    <div className='export-form'>
                        <form action={`http://localhost:5000/export/${projectId}`}>
                            <input type="submit" value="Export" />
                        </form>
                    </div>
                </div>

                <div className='video-player'>
                    <ReactPlayer
                        ref={playerRef}
                        url={videoFilePath}
                        controls={true}
                        onSeek={handleSeekChange}
                        onDuration={handleDuration}
                        onProgress={handleProgress}
                    />
                    <h>Currently at: {playerState.played} seconds</h>
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
