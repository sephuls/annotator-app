export function RowAnnotationStream(props) {
    return (
        <div className='timeline-row'>
            <div className='timeline-row-options'>
                Annotation Stream: {props.annotationStream.name} {props.annotationStream.id}
            </div>
            <div className='timeline-row-data'>
            </div>
        </div>
    );
}
