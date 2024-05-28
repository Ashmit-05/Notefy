'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { IoDocumentOutline } from 'react-icons/io5';
import { MdFileUpload } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import History from './history';

export default function UserCard() {
    const [loading, setLoading] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [summaryUpdate, setSummaryUpdate] = useState(0);
    const userID = localStorage.getItem('userid');

    const handlePdfUpload = async (pdf) => {
        if (!pdf) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', pdf);
        formData.append('userid', userID);

        try {
            const response = await fetch('http://localhost:8080/note', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('PDF uploaded successfully');
                setSummaryUpdate((prev) => prev + 1);
            } else {
                toast.error('PDF upload failed');
                setSelectedPdf(null);
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
            toast.error('Error uploading PDF');
            setSelectedPdf(null);
        } finally {
            setLoading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const selectedPdf = acceptedFiles[0];
            setSelectedPdf(selectedPdf);
            handlePdfUpload(selectedPdf);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <main>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <div className="flex justify-center items-center p-5">
                        <Button variant="default" className="p-5" onClick={() => setIsDialogOpen(true)}>
                            <MdFileUpload className="p-2 mx-auto" size={36} /> Upload PDF
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <div {...getRootProps()} className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800"
                            >
                                {loading ? (
                                    <div className="text-center max-w-md">
                                        <p className="text-sm font-semibold">Uploading PDF</p>
                                        <p className="text-xs text-gray-400">
                                            Do not refresh or perform any other action while the PDF is being uploaded
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        {selectedPdf ? (
                                            <>
                                                <p className="text-sm font-semibold">Selected {selectedPdf.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    Summarized pdf. You can find in History section now.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <IoDocumentOutline
                                                    className="border p-2 rounded-md max-w-min mx-auto"
                                                    size={32}
                                                />
                                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Drag a PDF</span>
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-400">
                                                    Click here to upload
                                                </p>
                                            </>
                                        )}
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
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setSelectedPdf(null);
                            }}
                            disabled={!selectedPdf || loading}
                        >
                            {loading ? 'Uploading...' : 'Close'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <History summaryUpdate={summaryUpdate} />
        </main>
    );
}
