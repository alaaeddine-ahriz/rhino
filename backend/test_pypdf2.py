#!/usr/bin/env python3
"""
Simple test script to verify PyPDF2 installation
"""

try:
    print("Testing PyPDF2 import...")
    import PyPDF2
    print(f"PyPDF2 imported successfully! Version: {PyPDF2.__version__}")
    
    # Test with a sample PDF if available
    import os
    pdf_files = []
    for root, dirs, files in os.walk('cours'):
        for file in files:
            if file.lower().endswith('.pdf'):
                pdf_files.append(os.path.join(root, file))
    
    if pdf_files:
        test_file = pdf_files[0]
        print(f"Testing PDF reading with: {test_file}")
        try:
            with open(test_file, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                num_pages = len(reader.pages)
                print(f"Successfully opened PDF with {num_pages} pages")
                
                # Try to extract text from the first page
                if num_pages > 0:
                    text = reader.pages[0].extract_text()
                    print(f"First 100 chars of text: {text[:100]}...")
        except Exception as e:
            print(f"Error reading PDF: {e}")
    else:
        print("No PDF files found to test")

except ImportError as e:
    print(f"ERROR: Could not import PyPDF2: {e}")
    print("\nTry installing it with: pip install PyPDF2==3.0.1")

print("\nDone!") 