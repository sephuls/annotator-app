import { MoCapStream } from "./MoCapStream";
import { VideoStream } from "./VideoStream";


export function DataStream({dataStream, startIndex, endIndex}) {
    const start = ((dataStream.start_index - startIndex) / (endIndex - startIndex)) * 1040;
    const width = ((dataStream.end_index - dataStream.start_index) / (endIndex - startIndex)) * 1040;

    function renderStreams() {
        if (dataStream.video_stream !== null && dataStream.mocap_stream !== null) {
            return <div>
                        <VideoStream start={start} width={width}/>
                        <MoCapStream start={start} width={width}/>
                    </div>;
        } else if (dataStream.video_stream !== null) {
            return <VideoStream start={start} width={width}/>;
        } else if (dataStream.mocap_stream !== null) {
            return <MoCapStream start={start} width={width}/>;
        } else {
            return <div className='data-stream'></div>;
        }
    }

    return (
        <div>
            { renderStreams() }
        </div>
    );
}
