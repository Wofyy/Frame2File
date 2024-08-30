
# Modern Video to PDF Scanner

![Scanner Demo](link-to-demo-gif-or-image.gif)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)


## Introduction
Modern Video to PDF Scanner is a Python project that converts video files into PDF documents. With this tool, you can easily digitize documents by uploading a video file containing the document pages, and the application will process it to produce a PDF version of the document.

## Features
- Convert video files (containing document pages) to PDFs.
- Simple and user-friendly web interface for uploading videos.
- Efficient processing using Python and video processing libraries.
- High-quality output PDF with customizable settings.

## Demo Screenshot


![Screenshot (2363)](https://github.com/SAHILGAWLI/Kheencho/assets/100032163/e8a12c78-e3f9-4745-8dec-11c1f14d9e6a)






![Screenshot (2364)](https://github.com/SAHILGAWLI/Kheencho/assets/100032163/3863cca3-e73c-4822-bb9d-79ad6026b556)






![Screenshot (2365)](https://github.com/SAHILGAWLI/Kheencho/assets/100032163/3b50cbe8-f92c-4c13-a713-ba1e7f1b36e5)


## Installation
Follow these steps to set up the project:

### Step 1: Install the required package to create virtual environments if not already installed
```bash
sudo apt install python3-venv
```

### Step 2: Create a virtual environment in your project directory
```bash
python3 -m venv venv
```

### Step 3: Activate the virtual environment
```bash
source venv/bin/activate
```

### Step 4: Install your packages within the virtual environment
```bash
pip install opencv-python pytesseract numpy img2pdf flask Flask-WTF WTForms scikit-image Pillow flask-socketio flask-cors
```

