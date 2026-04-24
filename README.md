# Cloud Simulation Demo

> A full-stack local AWS simulation for **Software Validation** coursework.  
> Uploads files through a React UI into a LocalStack S3 bucket, triggers a Lambda function, and provides manual validation tools to verify the backend process.

---

## Architecture

```
┌────────────┐       ┌─────────────────────┐       ┌──────────────┐
│  React UI  │──S3──▸│  LocalStack (Docker) │──S3──▸│  Lambda Fn   │
│  (Vite)    │ PUT   │  127.0.0.1:4566      │ event │  handler.js  │
└────────────┘       └─────────────────────┘       └──────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Manual Audit   │
                    │ (view_logs.js)  │
                    └─────────────────┘
```

## Prerequisites

| Tool              | Version  |
| ----------------- | -------- |
| Node.js           | >= 18    |
| Docker & Compose  | Latest   |

## Quick Start

```bash
# 1. Install root dependencies
npm install

# 2. Start the entire environment (Infra + Backend + Frontend)
npm run demo
```

## Manual Validation Workflow

To prove the cloud simulation is working correctly, follow these steps:

1. **Upload a File**: Open `http://localhost:5173` in your browser and upload any small file (e.g., `.docx` or `.pdf`).
2. **Run the Audit**: Open a new terminal and run:
   ```bash
   node view_logs.js
   ```
3. **Verify**: You should see the Lambda logs confirming that the file was detected and validated by the backend logic.

## Project Structure

```
.
├── docker-compose.yml          # LocalStack container definition
├── package.json                # Root orchestration scripts
├── apply_cors.js               # Utility to unlock S3 for the browser
├── view_logs.js                # Custom tool to see CloudWatch logs
│
├── backend/
│   ├── handler.js              # Lambda function (S3 event processor)
│   ├── serverless.yml          # Serverless Framework config (LocalStack)
│   └── package.json
│
└── frontend/
    └── src/
        ├── App.jsx             # Upload UI component
        ├── App.css             # Premium dark-mode styles
        └── main.jsx            # React entry point
```

## Available Scripts

| Script               | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run infra:up`   | Start LocalStack Docker container                |
| `npm run setup`      | Start infra + deploy serverless backend          |
| `npm run frontend:start`| Start Vite dev server on port 5173            |
| `npm run demo`       | **Full demo**: setup → frontend                  |
| `node view_logs.js`  | **Manual Audit**: Fetch logs from CloudWatch     |

## How It Works

1. **Docker Compose** spins up a LocalStack container exposing S3 and Lambda on `127.0.0.1:4566`.
2. **Serverless Framework** deploys a Lambda function that listens for `s3:ObjectCreated:*` events on the `university-docs` bucket.
3. The **React frontend** uses `@aws-sdk/client-s3` to upload files directly to LocalStack.
4. **CORS Fix**: The `apply_cors.js` utility ensures the local browser can securely talk to the LocalStack container.
5. **Validation**: The `view_logs.js` script queries CloudWatch Logs to provide "Proof of Validation" for the demo.

## License

MIT

---
**Author:** Ahmed Firas Mahmoud Khalil (Student ID: U23LYAZ801)
