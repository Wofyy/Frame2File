import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader'; // Import the Loader component

import './Home.css'; // Import the CSS file for styling

const Home = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate();

    const validateForm = (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select a file.');
            return false;
        }
        if (!selectedFile.type.startsWith('video/')) {
            setError('Invalid file type. Please select a video file.');
            return false;
        }
        return true;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError('');
        }
    };

    const submitForm = async (event) => {
        event.preventDefault();
        if (!validateForm(event)) return;

        setLoading(true); // Set loading to true

        const formData = new FormData();
        formData.append('file', selectedFile);

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
                navigate('/success');  // Navigate to SuccessPage
            } else {
                setError(result.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Request failed', error);
            setError('Request failed. Please try again.');
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    return (
        <div className="main-content">
            {loading ? (
                <Loader /> // Display Loader while processing
            ) : (
                <div className="container">
                    <div className="content-area">
                        <div className="page-title text-center">
                            <h1>File Converter</h1>
                            <h2>Convert your video to PDF</h2>
                        </div>
                        <div className="converter-container">
                            <div className="converter-wrapper tall">
                                <div className="converter">
                                    <div className="file-source-button-wrapper file-source-button-resizable">
                                        <form name="myForm" onSubmit={submitForm}>
                                            <div className="file-source-button">
                                                <label htmlFor="pc-upload-add" className="action-label">
                                                    <span>Choose Files</span>
                                                </label>
                                                <input type="file" id="pc-upload-add" name="pc-upload" onChange={handleFileChange} />
                                            </div>
                                            {error && <span id="error-message" style={{ color: 'red' }}>{error}</span>}
                                            <button type="submit">Upload and Convert</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="file-source-caption d-none d-md-block text-left">
                                    <span>Drop files here. 100 MB maximum file size recommended</span>
                                </div>
                            </div>
                        </div>
                        <div className="advantages">
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <p className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                            <path d="M28,10v5h-5l2.279-2.279C23.752,11.609,21.925,11,20,11c-4.962,0-9,4.038-9,9h-1c0-5.514,4.486-10,10-10 c2.191,0,4.271,0.711,5.993,2.007L28,10z"></path>
                                            <path d="M20,2C10.075,2,2,10.075,2,20c0,9.925,8.075,18,18,18c9.925,0,18-8.075,18-18C38,10.075,29.925,2,20,2z M20,37c-9.374,0-17-7.626-17-17S10.626,3,20,3s17,7.626,17,17S29.374,37,20,37z M29,20h1c0,5.514-4.486,10-10,10 c-2.193,0-4.272-0.711-5.993-2.007L12,30v-5h5l-2.279,2.279C16.248,28.391,18.075,29,20,29C24.963,29,29,24.963,29,20z"></path>
                                        </svg>
                                    </p>
                                    <h3>Mp4 to Pdf supported</h3>
                                    <p>A world-class video-to-PDF converter, the first of its kind! More than 5+ format support coming soon...</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <p className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                            <path d="M13.35,29.4c-0.111,0-0.222-0.037-0.312-0.109c-0.154-0.123-0.222-0.326-0.172-0.518l1.825-6.968 l-4.535-4.284c-0.139-0.131-0.191-0.33-0.134-0.512c0.057-0.183,0.212-0.316,0.401-0.346l6.218-0.963l2.908-6.019 c0.167-0.345,0.733-0.345,0.9,0l2.908,6.019l6.218,0.963c0.189,0.029,0.345,0.163,0.401,0.346c0.057,0.182,0.005,0.381-0.134,0.512 l-4.535,4.284l1.825,6.968c0.051,0.191-0.017,0.395-0.171,0.518c-0.155,0.124-0.369,0.144-0.543,0.053L20,26.009l-6.419,3.335 C13.508,29.382,13.429,29.4,13.35,29.4z M20,24.945c0.079,0,0.158,0.019,0.23,0.057l5.65,2.936l-1.614-6.165 c-0.047-0.177,0.007-0.365,0.14-0.49l4.008-3.786l-5.468-0.847c-0.163-0.025-0.303-0.128-0.374-0.276L20,11.049l-2.572,5.323 c-0.071,0.148-0.211,0.251-0.374,0.276l-5.469,0.847l4.008,3.786c0.133,0.125,0.187,0.313,0.141,0.49l-1.615,6.165l5.65-2.936 C19.842,24.964,19.921,24.945,20,24.945z"></path>
                                        </svg>
                                    </p>
                                    <h3>Fast and easy</h3>
                                    <p>Just drop your files on the page, by clicking on the "Choose Files" button. Wait a little for the process to complete. We aim to do all our conversions in under 1-2 minutes.</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <p className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                            <path d="M24.781,24.46L20,19.678V34h-1V19.678l-4.782,4.782l-0.637-0.637l5.918-5.918l5.918,5.918L24.781,24.46z"></path>
                                            <path d="M33.812,32H26v-1h7.812C36.673,31,39,28.771,39,26.031s-2.327-4.969-5.188-4.969 c-0.181,0-0.395-0.093-0.482-0.25c-0.089-0.158-0.133-0.346-0.038-0.5c0.554-0.91,0.834-1.877,0.834-2.875 c0-3.17-2.691-5.75-5.999-5.75c-0.902,0-1.797,0.209-2.661,0.623c-0.237,0.113-0.524,0.023-0.652-0.207 C23.053,8.955,19.652,7,15.937,7c-5.548,0-10.062,4.332-10.062,9.656c0,0.761,0.104,1.549,0.311,2.344 c0.035,0.133,0.013,0.275-0.061,0.392c-0.073,0.117-0.192,0.198-0.327,0.224C3.018,20.157,1,22.88,1,26.031 C1,28.771,3.327,31,6.188,31H14v1H6.188C2.772,32,0,29.224,0,26.031C0,22.606,2.623,20,6.188,20c0.23,0,0.445-0.092,0.602-0.257 c0.155-0.164,0.214-0.396,0.149-0.612c-0.34-1.256-0.511-2.591-0.511-3.861C6.528,11.758,10.15,8,15.936,8 c2.391,0,4.658,1.084,6.281,2.953c0.253,0.292,0.667,0.393,1.026,0.238c0.356-0.158,0.587-0.49,0.587-0.867 c0-4.529,3.551-8.2,7.999-8.2s8,3.671,8,8.2c0,1.155-0.33,2.251-0.936,3.162c-0.124,0.207-0.071,0.442,0.115,0.58 c0.189,0.138,0.415,0.178,0.631,0.121C35.708,12.367,37,14.142,37,16.312c0,1.82-0.529,3.592-1.509,5.085c-0.035,0.065-0.092,0.11-0.159,0.135 C34.35,21.571,34.048,21.565,33.812,21.565C31.055,21.565,28,24.605,28,28c0,0.888,0.292,1.751,0.812,2.478 C29.741,31.481,30.64,32,31.812,32H33.812z"></path>
                                        </svg>
                                    </p>
                                    <h3>Secure and safe</h3>
                                    <p>Your files are transferred securely using HTTPS and are automatically deleted from our servers after processing. No data will be stored, nor shared with third parties.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
