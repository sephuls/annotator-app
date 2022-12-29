import { useEffect, useState } from 'react';
import { DataStream } from './DataStream';
import httpClient from "../httpClient";
import Draggable from 'react-draggable';


export const Timeline = (props) => {
    const [dataStreams, setDataStreams] = useState([]);
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

    return (
        <div className="timeline">
            <div className='timeline-header'>
                <div className='ticks'></div>
            </div>
            <div className='timeline-content'>
                <Draggable
                    axis='x'
                    onDrag={props.handleCursorChange}
                    defaultPosition={{x: 0, y: 0}}
                    position={props.cursorPosition}
                >
                    <div className="time-cursor" >drag me!</div>
                </Draggable>
                {Array(numRows).fill(0).map((_, index) => (
                    <div key={index} className='timeline-row'>
                        <div className='timeline-row-options'></div>
                        <div className='timeline-row-data'>
                            {index < dataStreams.length
                            ? <DataStream
                                dataStream={dataStreams[index]}
                                startIndex={props.startIndex}
                                endIndex={props.endIndex}/>
                            : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
