import { useEffect, useState } from 'react';
import httpClient from "../httpClient";
import { Cursor } from './Cursor';
import { RowAnnotationStream } from './RowAnnotationStream';
import { RowDataStream } from './RowDataStream';
import { RowEmpty } from './RowEmpty';


export const Timeline = (props) => {
    const [dataStreams, setDataStreams] = useState([]);
    const [annotationStreams, setAnnotationStreams] = useState([]);
    const numRows = 10;

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get(`http://localhost:5000/data_streams/${props.projectId}`);
                if (resp.status !== 204) {
                    setDataStreams(resp.data);
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
                } else {
                    console.log('No projects found');
                }
            } catch (error) {
                console.log("Not authenticated");
            }
        })();
    }, []);

    function renderStreams(index) {
        if (index < dataStreams.length) {
            return <RowDataStream
                        projectId={props.projectId}
                        dataStream={dataStreams[index]}
                        startIndex={props.startIndex}
                        endIndex={props.endIndex}
                        key={index}
                        handleDisplay={props.handleDisplay}
                        setVideoFilePath={props.setVideoFilePath}
                    />;
        } else if (index < (dataStreams.length + annotationStreams.length)) {
            return <RowAnnotationStream
                        projectId={props.projectId}
                        annotationStream={annotationStreams[index-dataStreams.length]}
                        startIndex={props.startIndex}
                        endIndex={props.endIndex}
                        cursorPosition={props.cursorPosition}
                        key={index}
                    />;
        } else {
            return <RowEmpty
                        projectId={props.projectId}
                        key={index}
                    />;
        }
    }

    return (
        <div className="timeline">
            <div className='timeline-header'>
                <div className='timeline-options-header'></div>
                <div className='ticks'></div>
            </div>
            <div className='timeline-content'>
                <Cursor
                    handleCursorChange={props.handleCursorChange}
                    cursorPosition={props.cursorPosition}
                    selectedVideoStream={props.selectedVideoStream}
                />
                {Array(numRows).fill(0).map((_, index) => (renderStreams(index)))}
            </div>
        </div>
    )
}
