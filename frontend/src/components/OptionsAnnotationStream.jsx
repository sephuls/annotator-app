import httpClient from "../httpClient";


export function OptionsAnnotationStream(props) {
    const handleDeleteAnnotationStream = async (e) => {
        try {
            httpClient.delete(`http://localhost:5000/annotation_streams/${props.annotationStream.id}`)
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
                Annotation Stream: {props.annotationStream.name} {props.annotationStream.id}
            </div>
            <div className="timeline-row-options-buttons">
                <button
                    className="timeline-row-button"
                    onClick={props.handleSubmitAnnotation}
                    style={{'backgroundColor': 'rgba(255, 0, 0, 0.383)'}}
                >
                    {props.annotationStart
                    ? 'End annotation'
                    : 'Start annotation'}
                </button>
                <button className="timeline-row-button" onClick={handleDeleteAnnotationStream}>Delete Annotation Stream</button>
            </div>
        </div>
    );
}
