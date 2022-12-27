export function VideoStream({dataStream, start, width}) {
    return (
        <div className='video-stream' style={{height: '18px', left: `${start}px`, width: `${width}px`}}></div>
    );
}
