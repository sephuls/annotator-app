import { useEffect, useState } from 'react';
import { DataStream } from './DataStream';
import httpClient from "../httpClient";
import { Cursor } from './Cursor';
import { UploadButton } from './UploadButton';


export const Timeline = (props) => {
    const [dataStreams, setDataStreams] = useState([]);
    const [annotationStreams, setAnnotationStreams] = useState([]);
    // const [videoFilePath, setVideoFilePath] = useState(null);
    // const [videoFilePath, setVideoFilePath] = useState(null);
    // const [videoFilePath, setVideoFilePath] = useState(null);
    const numRows = 14;

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get(`http://localhost:5000/data_streams/${props.projectId}`);
                if (resp.status !== 204) {
                    setDataStreams(resp.data);
                    console.log(resp.data);
                } else {
                    console.log('No projects found');
                }
            } catch (error) {
                console.log("Not authenticated");
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get(`http://localhost:5000/annotation_streams/${props.projectId}`);
                if (resp.status !== 204) {
                    setAnnotationStreams(resp.data);
                    console.log(resp.data);
                } else {
                    console.log('No projects found');
                }
            } catch (error) {
                console.log("Not authenticated");
            }
        })();
    }, []);

    const handleVideoStreamUpload = async (e, dataStreamId) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        try {
            const resp = httpClient.post(`http://localhost:5000/video_streams/${props.projectId}/${dataStreamId}`, formData)
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleMoCapStreamUpload = async (e, dataStreamId) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("source", "Live Link Face");
        try {
            const resp = httpClient.post(`http://localhost:5000/mocap_streams/${props.projectId}/${dataStreamId}`, formData)
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleAnnotationStreamCreation = async (e) => {
        try {
            const resp = httpClient.post(`http://localhost:5000/annotation_streams/${props.projectId}`)
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleDataStreamCreation = (event) => {
        try {
            const resp = httpClient.post(`http://localhost:5000/data_streams/${props.projectId}`)
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <div className="timeline">
            <div className='timeline-header'>
                <div className='ticks'></div>
            </div>
            <div className='timeline-content'>
                <Cursor
                    handleCursorChange={props.handleCursorChange}
                    cursorPosition={props.cursorPosition}
                />
                {Array(numRows).fill(0).map((_, index) => (
                    index < dataStreams.length
                    ? <div key={index} className='timeline-row'>
                        <div className='timeline-row-options'>
                            Data Stream: {dataStreams[index].name}
                            <UploadButton
                                dataStreamId={dataStreams[index].id}
                                name='Video Stream'
                                handleUpload={(e) => {handleVideoStreamUpload(e, dataStreams[index].id)}}
                            />
                            <UploadButton
                                dataStreamId={dataStreams[index].id}
                                name='MoCap Stream'
                                handleUpload={(e) => {handleMoCapStreamUpload(e, dataStreams[index].id)}}/>

                        </div>
                        <div className='timeline-row-data'>
                            <DataStream
                                dataStream={dataStreams[index]}
                                startIndex={props.startIndex}
                                endIndex={props.endIndex}
                            />
                        </div>
                    </div>
                    : <div key={index} className='timeline-row'>
                        <div className='timeline-row-options'>
                            <button onClick={handleDataStreamCreation}>Data Stream</button>
                            <button onClick={handleAnnotationStreamCreation}>Annotation Stream</button>
                        </div>
                        <div className='timeline-row-data' />
                    </div>)
                )}
            </div>
        </div>
    )
}
