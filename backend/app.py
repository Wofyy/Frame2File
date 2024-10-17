from flask import Flask, jsonify, request, send_from_directory, abort, send_file,  render_template , redirect, url_for, flash
from flask_cors import CORS
import os
import cv2
import pytesseract
import numpy as np
import time
import img2pdf
import platform
from flask_socketio import SocketIO
from skimage.metrics import structural_similarity as ssim
from PIL import Image

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
CORS(app)  # Allow CORS for cross-origin requests

# Set up pytesseract path based on OS
if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Directories
UPLOAD_FOLDER = './backend/static/uploads'
FRAME_DIR = './backend/static/frames'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(FRAME_DIR, exist_ok=True)

# Constants
FPS_LIMIT = 30
MAX_FRAMES = FPS_LIMIT * 10
MIN_LAP_VAR = 100
SSIM_THRESHOLD = 0.9
RESIZE_WIDTH = 800

def safe_remove(file_path):
    try:
        os.remove(file_path)
    except PermissionError:
        # If the file is still in use, wait and retry
        time.sleep(1)
        try:
            os.remove(file_path)
        except PermissionError:
            print(f"Unable to delete file: {file_path} because it is still in use.")


def clear_directory(directory):
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            safe_remove(file_path)

def extract_frames(video_file_path: str):
    vidcap = cv2.VideoCapture(video_file_path)
    fps = int(vidcap.get(cv2.CAP_PROP_FPS))
    
    if fps > FPS_LIMIT:
        print(f"WARNING: Frame rate of {fps} fps exceeds limit of {FPS_LIMIT} fps. Processing may be slower than expected.")

    count = 0
    success, image = vidcap.read()
    prev_image_resized = None

    while success and count < MAX_FRAMES:
        image_resized = cv2.resize(image, (RESIZE_WIDTH, RESIZE_WIDTH))

        if count > 0:
            ssim_val = ssim(image_resized, prev_image_resized, multichannel=True, win_size=3)
            if ssim_val > SSIM_THRESHOLD:
                success, image = vidcap.read()
                continue

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        h, w = gray.shape
        roi_size = min(h, w) // 2
        roi_y, roi_x = (h - roi_size) // 2, (w - roi_size) // 2
        roi = gray[roi_y:roi_y + roi_size, roi_x:roi_x + roi_size]
        lap_var = cv2.Laplacian(roi, cv2.CV_64F).var()
        if lap_var < MIN_LAP_VAR:
            success, image = vidcap.read()
            continue

        if w > h:
            image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)

        frame_path = os.path.join(FRAME_DIR, f'frame_{count}.jpg')
        cv2.imwrite(frame_path, image.astype(np.uint8))

        count += 1
        vidcap.set(cv2.CAP_PROP_POS_FRAMES, count * fps)
        success, image = vidcap.read()
        prev_image_resized = image_resized.copy() if image is not None else None

    vidcap.release()

    ocr_text = ''
    for i in range(count):
        frame_path = os.path.join(FRAME_DIR, f'frame_{i}.jpg')
        image = cv2.imread(frame_path)
        document, text = extract_document(image)
        ocr_text += text
        doc_path = os.path.join(FRAME_DIR, f'document_{i}.jpg')
        cv2.imwrite(doc_path, document.astype(np.uint8))

    pdf_path = os.path.join(FRAME_DIR, 'output.pdf')
   
    try:
     with open(pdf_path, 'w+b') as f:
        f.write(img2pdf.convert([open(os.path.join(FRAME_DIR, f'document_{i}.jpg'), 'rb') for i in range(count)]))
     print(f"PDF successfully created at {pdf_path}")
     return pdf_path, ocr_text

    except ValueError:
      print("Error: Unable to process the list of images for PDF conversion.")
    raise ValueError("Unable to process empty list: the uploaded field is invalid.")
   

def extract_document(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    max_contour = max(contours, key=cv2.contourArea)
    rect = cv2.minAreaRect(max_contour)
    box = cv2.boxPoints(rect).astype(int)

    width, height = rect[1]
    src_pts = box.astype("float32")
    dst_pts = np.array([[0, 0], [width-1, 0], [width-1, height-1], [0, height-1]], dtype="float32")
    M = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped = cv2.warpPerspective(image, M, (int(width), int(height)))

    ocr_text = pytesseract.image_to_string(gray)
    return image, ocr_text

@app.route('/api/upload', methods=['POST'])
def upload():
    print("Received request at /api/upload")
    # Clear the frames directory at the start
    clear_directory(FRAME_DIR)

    file = request.files.get('file')
    
    if file is None or file.filename == '':
        return jsonify({'status': 'error', 'message': 'No file selected'}), 400
    
    if not file.content_type.startswith('video/'):
        return jsonify({'status': 'error', 'message': 'Invalid file type. Please upload a video.'}), 400
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    pdf_path, ocr_text = extract_frames(file_path)
      
    
    # Clear the uploads directory after processing
    clear_directory(UPLOAD_FOLDER)
     
     
    try:
        # Assuming successful file handling and PDF generation
        return jsonify({'pdf_url': '/success'})  # Redirect to success page
    
    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 400
    
    return jsonify({'status': 'success', 'pdf_url': f'/static/frames/output.pdf', 'ocr_text': ocr_text})


# Make sure the 'download_pdf' route is defined correctly and pointing to the right file path

@app.route('/download_pdf', methods=['GET'])
def download_pdf():
    # Define the path to the PDF file
    pdf_path = os.path.join(app.root_path, 'static', 'frames', 'output.pdf')
    
    # Check if the PDF file exists
    if not os.path.exists(pdf_path):
        return "File not found!", 404
    
    # Send the file to the client
    return send_file(pdf_path, as_attachment=True)


@app.route('/static/frames/<path:filename>')
def serve_file(filename):
    return send_from_directory('static/frames', filename)       
 
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)