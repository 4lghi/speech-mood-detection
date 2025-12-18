FROM python:3.11-slim

# supaya log langsung muncul
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy source code
COPY . .

# port FastAPI
EXPOSE 8000

# start server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
