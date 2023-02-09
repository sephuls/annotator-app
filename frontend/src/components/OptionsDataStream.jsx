import httpClient from "../httpClient";
import { UploadButton } from './UploadButton';


export function OptionsDataStream(props) {
    const handleVideoStreamUpload = (e, dataStreamId) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        try {
            httpClient.post(`http://localhost:5000/video_streams/${props.projectId}/${dataStreamId}`, formData)
            .then(resp => {
                window.location.reload(false);
            })
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleVideoStreamDelete = (e, dataStreamId) => {
        try {
            httpClient.delete(`http://localhost:5000/video_streams/${dataStreamId}`)
            .then(resp => {
                props.setVideoFilePath('');
                window.location.reload(false);
            })
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleMoCapStreamUpload = async (e, dataStreamId) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("source", "Live Link Face");
        try {
            httpClient.post(`http://localhost:5000/mocap_streams/${props.projectId}/${dataStreamId}`, formData)
            .then(resp => {
                window.location.reload(false);
            })
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleMoCapStreamDelete = (e, dataStreamId) => {
        try {
            httpClient.delete(`http://localhost:5000/mocap_streams/${dataStreamId}`)
            .then(resp => {
                window.location.reload(false);
            })
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleSync = async (e, dataStreamId) => {
        try {
            httpClient.patch(`http://localhost:5000/data_streams/${props.projectId}/${dataStreamId}/sync`)
            .then(resp => {
                window.location.reload(false);
            })
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <div className='timeline-row-options'>
            <div className="timeline-row-options-naming">
                Data Stream: {props.dataStream.name} {props.dataStream.id}
            </div>
            <div className="timeline-row-options-buttons">
                {props.dataStream.video_stream !== null
                ? <div>
                    <button
                        style={{'backgroundColor': 'rgba(30, 255, 0, 0.387)'}}
                        className="timeline-row-button"
                        onClick={(e) => {handleSync(e, props.dataStream.id)}}
                    >Sync</button>
                    <button
                        style={{'backgroundColor': 'rgba(255, 255, 0, 0.383)'}}
                        className="timeline-row-button"
                        onClick={(e) => {props.handleDisplay(e, props.dataStream)}}
                    >Display</button>
                    <button
                        className="timeline-row-button"
                        onClick={(e) => {handleVideoStreamDelete(e, props.dataStream.id)}}
                    >Delete Video Stream</button>
                </div>
                : <UploadButton
                        dataStreamId={props.dataStream.id}
                        name='Video Stream'
                        handleUpload={(e) => {handleVideoStreamUpload(e, props.dataStream.id)}}
                    />
                }

                {props.dataStream.mocap_stream !== null
                ? <button className="timeline-row-button" onClick={(e) => {handleMoCapStreamDelete(e, props.dataStream.id)}}>Delete MoCap Stream</button>
                : <UploadButton
                        dataStreamId={props.dataStream.id}
                        name='MoCap Stream'
                        handleUpload={(e) => {handleMoCapStreamUpload(e, props.dataStream.id)}}
                    />
                }
            </div>
        </div>
    );
}
