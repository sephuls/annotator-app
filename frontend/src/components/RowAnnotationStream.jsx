import { Annotation } from "./Annotation";
import { OptionsAnnotationStream } from "./OptionsAnnotationStream";
import { useState } from "react";
import httpClient from "../httpClient";

export function RowAnnotationStream(props) {
    const [annotationStart, setAnnotationStart] = useState(0);

    function posToIndex(pos) {
        return ((props.endIndex - props.startIndex) / 1040) * (pos - 394) + props.startIndex;
    }

    function indexToPos(index) {
        return (index - props.startIndex) * (1040 / (props.endIndex - props.startIndex)) + 394
    }

    const handleSubmitAnnotation = async (e) => {
        if(annotationStart) {
            try {
                httpClient.post(`http://localhost:5000/annotations/${props.projectId}/${props.annotationStream.id}`, {
                    label: "myLabel",
                    start_index: annotationStart,
                    end_index: posToIndex(props.cursorPosition.x)
                })
                .then(resp => {
                    setAnnotationStart(0)
                    window.location.reload(false);
                })
            } catch (ex) {
                console.log(ex);
            }
        } else {
            setAnnotationStart(posToIndex(props.cursorPosition.x))
            console.log(posToIndex(props.cursorPosition.x));
            console.log(posToIndex(400));
        }
    };

    return (
        <div className='timeline-row'>
            <OptionsAnnotationStream
                projectId={props.projectId}
                annotationStream={props.annotationStream}
                cursorPosition={props.cursorPosition}
                handleSubmitAnnotation={handleSubmitAnnotation}
                annotationStart={annotationStart}
            />
            <div className='timeline-row-data'>
                <div className="annotations">
                    {props.annotationStream.annotations.map((a, index) => (
                        <Annotation
                            key={index}
                            annotation={a}
                            startIndex={props.startIndex}
                            endIndex={props.endIndex}
                        />
                    ))}
                </div>
                {annotationStart
                ? <div
                    className="annotation-unfinished"
                    style={{float: 'left', left: `${indexToPos(annotationStart)}px`}}
                />
                : null}
            </div>
        </div>
    );
}
