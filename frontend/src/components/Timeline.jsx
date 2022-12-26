import { useEffect, useState } from 'react';
import { DataStream } from './DataStream';
import httpClient from "../httpClient"


export const Timeline = ({projectId}) => {
    const [dataStreams, setDataStreams] = useState([]);
    const minRows = 3;
    var emptyRows = Math.floor((minRows - dataStreams.length) / 2)

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.post(`http://localhost:5000/project/${projectId}/data_streams`);
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
        <div className="timeline-footer">
            <div className="timeline-options">
                <div className='timeline-options-header'>

                </div>
                {/* {dataStreams.map((dataStream) => (
                    <div className='timeline-editor-row'>
                        <div className='data-stream' key={dataStream.id}>
                            {dataStream.id}
                        </div>
                    </div>
                ))} */}
                {emptyRows > 0 ? (Array(emptyRows).fill(0).map((row, index) => (
                    <div key={index} className='timeline-options-row'>

                    </div>
                ))) : ("")}
            </div>
            <div className="timeline">
                <div className='timeline-header'></div>

                {dataStreams.map((dataStream) => (
                    <div>
                        <div key={dataStream.id} className='timeline-row'>
                            <DataStream dataStream={dataStream}/>
                        </div>
                        <div key={dataStream.id} className='timeline-row'>
                            <DataStream dataStream={dataStream}/>
                        </div>
                    </div>
                ))}
                {emptyRows > 0 ? (Array(emptyRows).fill(0).map((row, index) => (
                    <div key={index} className='timeline-row'>

                    </div>
                ))) : ("")}
            </div>
        </div>
    )
}
