// SuccessPage.js
import React from 'react';

const SuccessPage = () => {
  console.log("SuccessPage component is rendering");

  const downloadPDF = async () => {
    console.log("Fetching PDF from backend");

    try {
      // Fetch the PDF file from the Flask backend
      const response = await fetch('http://localhost:5000/download_pdf', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Convert response to a blob
      const blob = await response.blob();
      
      // Create a link element
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up by revoking the object URL and removing the element
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log("Download initiated");
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };

  return (
    <div>
      <h1>Success Page</h1>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default SuccessPage;
