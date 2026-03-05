# Use official Python image - standard version includes gcc and build tools
FROM python:3.11

WORKDIR /app
# Copy requirements first for better layer caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Railway injects $PORT dynamically and this healthcheck verifies readiness.
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD python -c "import os,urllib.request; urllib.request.urlopen(f'http://localhost:{os.getenv(\"PORT\", \"5000\")}/', timeout=5)" || exit 1

# Run Gunicorn
CMD gunicorn -w 4 -b 0.0.0.0:${PORT:-5000} main:app --log-level=info --timeout 120
