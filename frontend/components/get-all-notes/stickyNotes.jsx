import React, { useState } from 'react';

const StickyNote = ({ note }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`sticky-note ${isExpanded ? 'expanded' : ''}`}>
            <h3>{note.title}</h3>
            <p>
                {isExpanded ? note.description : `${note.description.substring(0, 100)}...`}
                {note.description.length > 100 && (
                    <button onClick={toggleExpand}>
                        {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                )}
            </p>
        </div>
    );
};

export default StickyNote;