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
            Data Stream: {props.dataStream.name} {props.dataStream.id}
            {props.dataStream.video_stream !== null
            ? <button onClick={(e) => {handleVideoStreamDelete(e, props.dataStream.id)}}>Delete Video Stream</button>
            : <UploadButton
                    dataStreamId={props.dataStream.id}
                    name='Video Stream'
                    handleUpload={(e) => {handleVideoStreamUpload(e, props.dataStream.id)}}
                />
            }

            {props.dataStream.mocap_stream !== null
            ? <button onClick={(e) => {handleMoCapStreamDelete(e, props.dataStream.id)}}>Delete MoCap Stream</button>
            : <UploadButton
                    dataStreamId={props.dataStream.id}
                    name='MoCap Stream'
                    handleUpload={(e) => {handleMoCapStreamUpload(e, props.dataStream.id)}}
                />
            }
            <button className="button-sync" onClick={(e) => {handleSync(e, props.dataStream.id)}}>Sync</button>
            <button className="button-sync" onClick={(e) => {props.handleDisplay(e, props.dataStream.video_stream)}}>Display</button>
        </div>
    );
}
