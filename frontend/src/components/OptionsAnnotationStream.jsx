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
            Annotation Stream: {props.annotationStream.name} {props.annotationStream.id}
            <button onClick={handleDeleteAnnotationStream}>Delete Annotation Stream</button>
            <button onClick={props.handleSubmitAnnotation}>
                {props.annotationStart
                ? 'Set end'
                : 'Set start'}
            </button>
        </div>
    );
}
