export function Annotation({annotation, startIndex, endIndex}) {
    const start = ((annotation.start_index - startIndex) / (endIndex - startIndex)) * 1040;
    const width = ((annotation.end_index - annotation.start_index) / (endIndex - startIndex)) * 1040;

    return (
        <div className="annotation" style={{zIndex: annotation.id, float: 'left', left: `${start}px`, width: `${width}px`}}>
            {annotation.label}
        </div>
    );
}
