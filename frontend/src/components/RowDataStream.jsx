import { DataStream } from './DataStream';
import { OptionsDataStream } from "./OptionsDataStream";


export function RowDataStream(props) {
    return (
        <div className='timeline-row'>
            <OptionsDataStream
                projectId={props.projectId}
                dataStream={props.dataStream}
            />
            <div className='timeline-row-data'>
                <DataStream
                    dataStream={props.dataStream}
                    startIndex={props.startIndex}
                    endIndex={props.endIndex}
                />
            </div>
        </div>
    );
}
