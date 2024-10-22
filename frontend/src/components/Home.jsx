import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

import './Home.css';

const Home = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = (file) => {
        if (!file) {
            setError('Please select a file.');
            return false;
        }
        if (!file.type.startsWith('video/')) {
            setError('Invalid file type. Please select a video file.');
            return false;
        }
        return true;
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (validateForm(file)) {
                setSelectedFile(file);
                setError('');
                await submitForm(file); // Automatically submit if valid
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');
        const file = event.dataTransfer.files[0];
        if (file) {
            if (validateForm(file)) {
                setSelectedFile(file);
                setError('');
                await submitForm(file); // Automatically submit if valid
            }
        }
    };

    const submitForm = async (file) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                navigate('/success');
            } else {
                setError(result.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Request failed', error);
            setError('Request failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content">
            {loading ? (
                <Loader />
            ) : (
                <div className="container">
                    <div className="content-area">
                        <div className="page-title">
                            <h1>File Converter</h1>
                            <h2>Convert your video to PDF</h2>
                        </div>
                        <div className="converter-container">
                            <div className="converter-wrapper"
                                 onDragOver={handleDragOver}
                                 onDragLeave={handleDragLeave}
                                 onDrop={handleDrop}>
                                <div className="file-upload-area">
                                    <label htmlFor="fileInput" className="choose-files-btn">
                                        Choose Files
                                    </label>
                                    <input 
                                        type="file" 
                                        id="fileInput" 
                                        onChange={handleFileChange}
                                        accept="video/*"
                                        className="file-input"
                                    />
                                    {error && <div className="error-message">{error}</div>}
                                    <div className="drop-text">
                                        Drop files here. 100 MB maximum file size recommended
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="advantages">
                            <div className="advantage-item">
                                <div className="advantage-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M16 2v4h4v12h-4v4H2V2h14zm1 9h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
                                    </svg>
                                </div>
                                <h3>Mp4 to Pdf supported</h3>
                                <p>A world-class video-to-PDF converter, the first of its kind! More than 5+ format support coming soon...</p>
                            </div>
                            <div className="advantage-item">
                                <div className="advantage-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                                        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                    </svg>
                                </div>
                                <h3>Fast and easy</h3>
                                <p>Just drop your files on the page, by clicking on the "Choose Files" button. Wait a little for the process to complete. We aim to do all our conversions in under 1-2 minutes.</p>
                            </div>
                            <div className="advantage-item">
                                <div className="advantage-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                                    </svg>
                                </div>
                                <h3>In the cloud</h3>
                                <p>All conversions take place in the cloud and will not consume any capacity from your computer.</p>
                            </div>
                            <div className="advantage-item">
                                <div className="advantage-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22l-1.92 3.32c-.12.22-.07.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                                    </svg>
                                </div>
                                <h3>Custom settings</h3>
                                <p>Advanced options coming soon... For example with a video converter you can choose filters, rotate, flip and other settings.</p>
                            </div>
                            <div className="advantage-item">
                                <div className="advantage-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                                    </svg>
                                </div>
                                <h3>Security guaranteed</h3>
                                <p>We delete uploaded files instantly once the pdf is created and ready for download. No one has access to your files and privacy is 100% guaranteed.</p>
                            </div>
                            <div className="advantage-item">
                                <div className="advantage-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"/>
                                    </svg>
                                </div>
                                <h3>All devices supported</h3>
                                <p>Frame2File is browser-based and works for all platforms. There is no need to download and install any software.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
