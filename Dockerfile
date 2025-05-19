# Use python slim image as base
FROM python:3.9-slim

# Add metadata
LABEL maintainer="DevOps Expert"
LABEL version="1.0"
LABEL description="Application d'inventaire Flask"

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DB_HOST=db \
    DB_USER=inventoryuser \
    DB_PASSWORD=secret \
    DB_NAME=inventory

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better cache usage
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -q -r requirements.txt

# Create non-root user
RUN useradd -r -u 1000 -m appuser

# Copy application files
COPY . .

# Create data directory and set permissions
RUN mkdir -p /app/data && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Create volume
VOLUME /app/data

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Set entrypoint and command
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
