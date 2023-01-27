import Draggable from 'react-draggable';


export function Cursor(props) {
    return (
        <Draggable
            axis='x'
            onDrag={props.handleCursorChange}
            position={props.cursorPosition}
            bounds={{
                left: 394,
                right: 1440}}
        >
            <div className="time-cursor">
                <div className="time-cursor-text"/>
            </div>
        </Draggable>
    );
}
