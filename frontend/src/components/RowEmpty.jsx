import httpClient from "../httpClient";


export const RowEmpty = (props) => {
    const handleAnnotationStreamCreation = async (e) => {
        try {
            httpClient.post(`http://localhost:5000/annotation_streams/${props.projectId}`, {'name': 'myAnnotationStream'})
            .then(resp => {
                window.location.reload(false);
            })
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleDataStreamCreation = async (e) => {
        try {
            httpClient.post(`http://localhost:5000/data_streams/${props.projectId}`)
            .then(resp => {
                window.location.reload(false);
            })
        } catch (ex) {
            console.log(ex);
        }
    };

    return  (
        <div className='timeline-row'>
            <div className='timeline-row-options'>
                <button className="timeline-row-button" onClick={handleDataStreamCreation}>Create a Data Stream</button>
                <button className="timeline-row-button" onClick={handleAnnotationStreamCreation}>Create an Annotation Stream</button>
            </div>
        </div>
    );

}
