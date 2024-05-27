import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotesComponent = () => {

    const [notes, setNotes] = useState([]);

    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="sticky-notes-container">
            {notes.map((note, index) => (
                <StickyNote key={index} note={note} />
            ))}
        </div>
    );
};

export default NotesComponent;
