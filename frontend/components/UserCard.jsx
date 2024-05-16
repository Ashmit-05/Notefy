'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { FiUpload } from 'react-icons/fi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { IoDocumentOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import sample from '@/assets/sample.jpg';

export default function UserCard() {
    const [loading, setLoading] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

    const removeSelectedPdf = () => {
        setLoading(false);
        setSelectedPdf(null);
    };

    const handlePdfUpload = async (pdf) => {
        if (!pdf) return;
        setLoading(true);
        // pdf upload logic here
        setLoading(false);
        console.log('Selected PDF:', pdf);
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
    };

    return (
        <main className="flex justify-center pt-10">
            <Card className="px-12 py-10 tablet:min-w-[500px] max-w-fit shadow-md">
                <CardContent className="px-0 flex items-stretch justify-normal gap-x-6">
                    <Image
                        width={1000}
                        height={1000}
                        className="shadow-md w-24 h-24 border rounded-md object-cover"
                        src={sample}
                        alt="sample pfp"
                    />

                    <div className="space-y-2">
                        {!selectedPdf && (
                            <div>
                                <h1 className="font-semibold">Upload PDF</h1>
                                <div className="text-gray-500 text-xs">We support PDF files under 10MB</div>
                            </div>
                        )}
                        {selectedPdf && (
                            <div>
                                <h1 className="text-xs">PDF submitted!</h1>
                                <div className="font-semibold text-gray-500">{selectedPdf.name}</div>
                                <div className="font-semibold text-gray-500 text-sm">
                                    {(selectedPdf.size / 1024).toFixed(2)} KB
                                </div>
                            </div>
                        )}
                        <div className="flex items-center justify-normal gap-x-3">
                            <Dialog>
                                <DialogTrigger>
                                    {!selectedPdf && (
                                        <div className="bg-black text-white flex items-center py-2 px-3 rounded-md hover:bg-opacity-80">
                                            <FiUpload size="1.2em" />
                                            <span className="ml-2 text-sm">Upload PDF</span>
                                        </div>
                                    )}
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="mb-3">Upload PDF</DialogTitle>
                                        <div {...getRootProps()} className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="dropzone-file"
                                                className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                            >
                                                {loading && (
                                                    <div className="text-center max-w-md">
                                                        <p className="text-sm font-semibold">Uploading PDF</p>
                                                        <p className="text-xs text-gray-400">
                                                            Do not refresh or perform any other action while the PDF is
                                                            being uploaded
                                                        </p>
                                                    </div>
                                                )}

                                                {!loading && !selectedPdf && (
                                                    <div className="text-center">
                                                        <div className="border p-2 rounded-md max-w-min mx-auto">
                                                            <IoDocumentOutline size="1.6em" />
                                                        </div>
                                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="font-semibold">Drag a PDF</span>
                                                        </p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-400">
                                                            Click to upload (PDF should be under 10 MB)
                                                        </p>
                                                    </div>
                                                )}

                                                {selectedPdf && !loading && (
                                                    <div className="text-center">
                                                        <p className="text-sm font-semibold">
                                                            Selected {selectedPdf.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            Click submit to upload the PDF
                                                        </p>
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

                                    <DialogFooter className="flex items-center justify-end gap-x-2">
                                        <DialogClose asChild>
                                            <Button onClick={removeSelectedPdf} type="button" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>

                                        <DialogClose asChild>
                                            <Button
                                                disabled={!selectedPdf || loading}
                                                size="sm"
                                                className="text-sm"
                                                onClick={handleUpload}
                                            >
                                                {loading ? 'Uploading...' : 'Submit'}
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Button
                                onClick={() => {
                                    setSelectedPdf(null);
                                    toast.error('PDF removed!');
                                }}
                                variant="outline"
                                disabled={!selectedPdf || loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
