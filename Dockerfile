FROM python:3.9-slim

WORKDIR /app

# Copy application files
COPY . /app

# Install required libraries if downloads needed
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Download required JS libraries
RUN mkdir -p lib && \
    curl -s "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" -o lib/three.min.js && \
    curl -s "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js" -o lib/chart.min.js

# Expose port
EXPOSE 8000

# Start HTTP server
CMD ["python", "-m", "http.server", "8000", "--bind", "0.0.0.0"]
