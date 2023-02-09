import { useEffect, useState, useRef } from 'react';
import { Timeline } from '../components/Timeline';
import httpClient from "../httpClient"
import ReactPlayer from 'react-player'
import useLocalStorage from "use-local-storage";


export function Project() {
    const projectId = 1;
    const [project, setProject] = useState({});
    const [videoFilePath, setVideoFilePath] = useLocalStorage(
        'videoFilePath', ""
    );
    // localStorage.removeItem('videoFilePath');
    const [selectedVideoStream, setSelectedVideoStream] = useLocalStorage(
        'selectedVideoStream', {
            'start': 0,
            'width': 1040
        }
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
        playerRef.current.seekTo(playerState.played);
    }, []);

    const handleSeekChange = (e) => {
        setPlayerState({
            ...playerState,
            played: parseFloat(e),
        })
    }

    const handleCursorChange = (e, data) => {
        setPlayerState({
            ...playerState,
            played: (data.x - (394 + selectedVideoStream.start)) / selectedVideoStream.width,
            cursorPosition: {x: data.x, y: 0}
        })
        playerRef.current.seekTo(playerState.played);
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
            played: parseFloat(state.playedSeconds / playerState.duration),
            cursorPosition: {
                x: parseInt(394 + selectedVideoStream.start + (state.playedSeconds / playerState.duration) * selectedVideoStream.width),
                y: 0
            }
        })
    }

    const handleDisplay = async (e, dataStream) => {
        setVideoFilePath(`../../${dataStream.video_stream.file_path.slice(22)}`);
        setSelectedVideoStream({
            'start': ((dataStream.start_index - project.start_index) / (project.end_index - project.start_index)) * 1040,
            'width': ((dataStream.end_index - dataStream.start_index) / (project.end_index - project.start_index)) * 1040
        });
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
                    <div className='project-navigation'>
                        <h2>{'<Project navigation>'}</h2>
                    </div>
                    <div className='export-form'>
                        <form action={`http://localhost:5000/export/${projectId}`}>
                            <input className='export-button' type="submit" value="Export to JSON" />
                        </form>
                    </div>
                </div>

                <div className='video-player'>
                    <ReactPlayer
                        ref={playerRef}
                        url={videoFilePath}
                        controls={true}
                        // onSeek={handleSeekChange}
                        onDuration={handleDuration}
                        onProgress={handleProgress}
                    />
                    <h4>Current video playing: {(videoFilePath).slice(21)}</h4>
                </div>
                <div className='display-side-right'></div>
            </div>

            <Timeline
                projectId={projectId}
                startIndex={project.start_index}
                endIndex={project.end_index}
                cursorPosition={playerState.cursorPosition}
                selectedVideoStream={selectedVideoStream}
                handleCursorChange={handleCursorChange}
                handleDisplay={handleDisplay}
                setVideoFilePath={setVideoFilePath}
            />
        </div>
    );
}
