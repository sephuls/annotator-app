export function UploadButton(props) {
    return (
        <div className='upload-label-button'>
            <input
                className='timeline-upload'
                type="file"
                onChange={props.handleUpload}
                id={props.name}
            />
            <label htmlFor={props.name} >Add {props.name}</label>
        </div>
    );
}
