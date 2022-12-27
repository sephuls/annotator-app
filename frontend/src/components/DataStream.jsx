import { MoCapStream } from "./MoCapStream";
import { VideoStream } from "./VideoStream";

export function DataStream({dataStream, startIndex, endIndex}) {
    const start = ((dataStream.start_index - startIndex) / (endIndex - startIndex)) * 1200
    const width = ((dataStream.end_index - dataStream.start_index) / (endIndex - startIndex)) * 1200

    return (
        <div>
            {dataStream.video_stream !== null && dataStream.mocap_stream !== null
            ?
                <div>
                    <VideoStream start={start} width={width}/>
                    <MoCapStream start={start} width={width}/>
                </div>
            :
                <div className='data-stream'></div>
            }
        </div>
    );
}
