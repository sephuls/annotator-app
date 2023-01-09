import Draggable from 'react-draggable';


export function Cursor(props) {
    return (
        <Draggable
            axis='x'
            onDrag={props.handleCursorChange}
            defaultPosition={{x: 0, y: 0}}
            position={props.cursorPosition}
            bounds={{left: 394, right: 1440}}
        >
            <div className="time-cursor" >drag me!</div>
        </Draggable>
    );
}
