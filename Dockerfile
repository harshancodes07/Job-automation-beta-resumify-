# ---- Stage 1: build the React frontend ----
FROM node:20-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Python runtime serving API + built frontend ----
FROM python:3.12-slim
WORKDIR /app

# System deps kept minimal; all Python deps ship as manylinux wheels
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
COPY tools/ ./tools/
COPY --from=frontend /app/frontend/dist ./frontend/dist

# Ephemeral, writable upload path (Hugging Face wipes /tmp on restart)
ENV DATA_DIR=/tmp/resumify
ENV PORT=7860

EXPOSE 7860
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
