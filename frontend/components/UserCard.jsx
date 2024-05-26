'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { IoDocumentOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function UserCard() {
    const [loading, setLoading] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [summary, setSummary]=useState();
    let userID = localStorage.getItem('userid')
    const handlePdfUpload = async (pdf) => {
        if (!pdf) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', pdf);
        formData.append('userid', userID);
        console.log(formData);
        try {
            const response = await fetch('http://localhost:8080/note', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                const data=await response.json();
                toast.success('PDF uploaded successfully');
            } else {
                toast.error('PDF upload failed');
                console.log("Response:", response);
            setSelectedPdf(null);

            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
            toast.error('Error uploading PDF');
            setSelectedPdf(null);

        } finally {
            setLoading(false);
            console.log('Selected PDF:', pdf);
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const selectedPdf = acceptedFiles[0];
            setSelectedPdf(selectedPdf);
            handlePdfUpload(selectedPdf);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleUpload = async () => {
        if (!selectedPdf) {
            toast.error('Please upload a PDF file');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:8080/notes?userid=${userID}`, {
                method: 'GET',
            });   
            if (response.status === 200) {
                const data = await response.json();
                toast.success('Summarized successfully');
                setSummary(data);
                console.log("Summary",selectedPdf);
            } else {
                toast.error('PDF upload failed');
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
            toast.error('Error uploading PDF');
        }
    };
    

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="p-5">
                    Upload PDF
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <div {...getRootProps()} className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {loading && (
                                <div className="text-center max-w-md">
                                    <p className="text-sm font-semibold">Uploading PDF</p>
                                    <p className="text-xs text-gray-400">
                                        Do not refresh or perform any other action while the PDF is being uploaded
                                    </p>
                                </div>
                            )}

                            {!loading && !selectedPdf && (
                                <div className="text-center">
                                    <IoDocumentOutline className="border p-2 rounded-md max-w-min mx-auto" size={32} />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Drag a PDF</span>
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-400">
                                        Click here to upload
                                    </p>
                                </div>
                            )}

                            {selectedPdf && !loading && (
                                <div className="text-center">
                                    <p className="text-sm font-semibold">Selected {selectedPdf.name}</p>
                                    <p className="text-xs text-gray-400">Click submit to upload the PDF</p>
                                </div>
                            )}
                        </label>

                        <Input
                            {...getInputProps()}
                            id="dropzone-file"
                            accept="application/pdf"
                            type="file"
                            className="hidden"
                            disabled={loading || selectedPdf !== null}
                        />
                    </div>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={handleUpload} disabled={!selectedPdf || loading}>
                        {loading ? 'Uploading...' : 'Summarize'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
