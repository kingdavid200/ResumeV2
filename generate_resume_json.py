#!/usr/bin/env python3
"""
generate_resume_json.py

This utility script demonstrates how to extract text from the provided résumé PDF
and can be extended to convert that text into a structured JSON format. It uses
the external `pdftotext` utility (part of the poppler suite) to convert the
document into plain text. The resulting output is written to stdout.

Usage:
  python generate_resume_json.py path/to/resume.pdf

Note:
  This script is intentionally lightweight and does not attempt to fully parse
  the résumé into structured data. It serves as an example of using Python
  within the project to handle content extraction or preprocessing tasks.
"""

import argparse
import subprocess
import sys
import json


def extract_text(pdf_path: str) -> str:
    """Run pdftotext on the given PDF and return the extracted text."""
    try:
        output = subprocess.check_output(['pdftotext', pdf_path, '-'], stderr=subprocess.DEVNULL)
        return output.decode('utf-8', errors='ignore')
    except FileNotFoundError:
        print('Error: pdftotext is not installed. Please install poppler-utils.', file=sys.stderr)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f'Error extracting text: {e}', file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description='Extract text from a résumé PDF.')
    parser.add_argument('pdf', help='Path to the résumé PDF file')
    args = parser.parse_args()
    text = extract_text(args.pdf)
    # Print the first 1000 characters to stdout as a preview
    preview = text[:1000].strip()
    print(preview)


if __name__ == '__main__':
    main()