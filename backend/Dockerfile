# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.12-slim

EXPOSE 8000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

# Install pip requirements
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

WORKDIR /app
COPY . /app

# Set environment variables for host and port
ENV ENVIRONMENT = docker

# Use the start.sh script as the entry point
CMD ["sh", "/app/start.sh"]