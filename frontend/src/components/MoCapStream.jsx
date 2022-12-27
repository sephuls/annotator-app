export function MoCapStream({dataStream, start, width}) {
    return (
        <div className='mocap-stream' style={{height: '18px', left: `${start}px`, width: `${width}px`}}></div>
    );
}
