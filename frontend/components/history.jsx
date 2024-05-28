import React, { useState, useEffect, useCallback } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from './ui/button';
import toast from 'react-hot-toast';

const History = ({ summaryUpdate }) => {
    const [allSummary, setAllSummary] = useState(() => {
        const savedSummary = localStorage.getItem('allSummary');
        return savedSummary ? JSON.parse(savedSummary) : null;
    });

    const fetchHistory = useCallback(async () => {
        const userID = localStorage.getItem('userid');
        try {
            const response = await fetch(`http://localhost:8080/notes?userid=${userID}`, {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                const reversedData = data.reverse();
                setAllSummary(reversedData);
                localStorage.setItem('allSummary', JSON.stringify(reversedData));
            } else {
                toast.error('Failed to fetch history');
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            toast.error('Error fetching history');
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory, summaryUpdate]); 

    return (
        <div className="w-full p-3">
            <div className="flex justify-between px-3">
                <h1 className="font-bold text-2xl">History:</h1>
                <Button variant="outline" onClick={fetchHistory}>
                    Reload
                </Button>
            </div>
            {allSummary ? (
                allSummary.map((summary, index) => (
                    <Accordion type="single" collapsible className="w-full" key={summary.id || index}>
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>{summary.title || "Untitled"}</AccordionTrigger>
                            <AccordionContent>{summary.text}</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))
            ) : (
                <p>Start Uploading your pdfs to summarize.</p>
            )}
        </div>
    );
};

export default History;
