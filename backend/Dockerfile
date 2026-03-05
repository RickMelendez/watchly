# Use official Python image - standard version includes gcc and build tools
FROM python:3.11

WORKDIR /app
# Copy requirements first for better layer caching
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY backend/ .

# Railway injects $PORT dynamically — healthcheck uses it
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT:-5000}/ || exit 1

# Run DB migrations then start Gunicorn
CMD flask db upgrade && gunicorn -w 4 -b 0.0.0.0:${PORT:-5000} main:app --log-level=info --timeout 120
