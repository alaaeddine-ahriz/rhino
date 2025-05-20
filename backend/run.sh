#!/bin/bash

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip is not installed. Please install pip and try again."
    exit 1
fi

# Remove the virtual environment if it exists and recreate
if [ -d "venv" ]; then
    echo "Removing existing virtual environment..."
    rm -rf venv
fi

echo "Creating a fresh virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip first
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies one by one to avoid resolution issues
echo "Installing dependencies individually..."
pip install fastapi
pip install uvicorn
pip install pydantic
pip install python-dotenv
pip install langchain
pip install langchain-openai
pip install openai
pip install pinecone-client
pip install langchain-pinecone
pip install pdfplumber
pip install python-docx
pip install python-pptx
pip install odfpy
pip install PyPDF2==3.0.1
pip install jinja2

# Create static directory if it doesn't exist
mkdir -p static

# Run the application
echo "Starting the application..."
echo "Access the web interface at: http://localhost:8000"
python app.py 

