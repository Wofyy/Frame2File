import os
import cv2
import pytesseract
import numpy as np
import img2pdf
from flask import Flask, render_template, request, send_from_directory, send_file, redirect, url_for
from flask_socketio import SocketIO
from skimage.metrics import structural_similarity as ssim
from PIL import Image
from flask_cors import CORS

#hii there

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Set the directory to store the extracted frames
frame_dir = 'static/frames/'

# Create or clear the directory to store the extracted frames
os.makedirs(frame_dir, exist_ok=True)
for file_name in os.listdir(frame_dir):
    file_path = os.path.join(frame_dir, file_name)
    if os.path.isfile(file_path):
        os.unlink(file_path)

# Constants
FPS_LIMIT = 30
MAX_FRAMES = FPS_LIMIT * 10  # Limit to 10 seconds of frames (300 frames for 30 fps video)
MIN_LAP_VAR = 100
SSIM_THRESHOLD = 0.9
RESIZE_WIDTH = 800

def extract_frames(video_file_path: str):
    # Read the uploaded video file
    vidcap = cv2.VideoCapture(video_file_path)
    fps = int(vidcap.get(cv2.CAP_PROP_FPS))
    
    if fps > FPS_LIMIT:
        print(f"WARNING: Frame rate of {fps} fps exceeds limit of {FPS_LIMIT} fps. Processing may be slower than expected.")

    count = 0
    success, image = vidcap.read()
    prev_image_resized = None

    while success and count < MAX_FRAMES:
        # Resize image to speed up comparison
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

        frame_path = os.path.join(frame_dir, f'frame_{count}.jpg')
        cv2.imwrite(frame_path, image.astype(np.uint8))

        count += 1
        vidcap.set(cv2.CAP_PROP_POS_FRAMES, count * fps)
        success, image = vidcap.read()
        prev_image_resized = image_resized.copy() if image is not None else None

    ocr_text = ''
    for i in range(count):
        frame_path = os.path.join(frame_dir, f'frame_{i}.jpg')
        image = cv2.imread(frame_path)
        document, text = extract_document(image)
        ocr_text += text
        doc_path = os.path.join(frame_dir, f'document_{i}.jpg')
        cv2.imwrite(doc_path, document.astype(np.uint8))

    pdf_path = os.path.join(frame_dir, 'output.pdf')
    try:
        with open(pdf_path, 'w+b') as f:
            f.write(img2pdf.convert([open(os.path.join(frame_dir, f'document_{i}.jpg'), 'rb') for i in range(count)]))
    except ValueError:
        raise ValueError("Unable to process empty list: the uploaded field is invalid.")

    return send_from_directory(directory=os.path.abspath(frame_dir), path='output.pdf', as_attachment=True), ocr_text

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

@app.route('/')
def index_html():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['pc-upload']
    file_path = 'static/uploads/' + file.filename
    file.save(file_path)
    return redirect(url_for('animation', video_file_path=file_path))

@app.route('/animation')
def animation():
    return render_template('animation.html')

@app.route('/success', methods=['GET'])
def success():
    video_file_path = request.args.get('video_file_path')
    pdf_file, ocr_text = extract_frames(video_file_path)
    os.remove(video_file_path)
    return render_template('success.html', pdf_file=pdf_file, ocr_text=ocr_text)

@app.route('/download_pdf')
def download_pdf():
    pdf_path = os.path.join(app.root_path, 'static/frames/output.pdf')
    return send_file(pdf_path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
