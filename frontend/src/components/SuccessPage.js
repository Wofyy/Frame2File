import React from 'react';
import './Success.css'; // Import CSS for styling

const SuccessPage = () => {
  console.log("SuccessPage component is rendering");

  const downloadPDF = async () => {
    console.log("Fetching PDF from backend");

    try {
      const response = await fetch('http://localhost:5000/download_pdf', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log("Download initiated");
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };

  return (
    <div className="success-container">
      <h1>Success!</h1>
      <p>Your file has been processed successfully.</p>
      <button className="download-btn" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

export default SuccessPage;
