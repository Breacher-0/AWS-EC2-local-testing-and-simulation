# Cloud Simulation Demo

> A full-stack local AWS simulation for **Software Validation** coursework.  
> Uploads files through a React UI into a LocalStack S3 bucket, triggers a Lambda function, and validates everything with Playwright E2E tests.

---

## Architecture

```
┌────────────┐       ┌─────────────────────┐       ┌──────────────┐
│  React UI  │──S3──▸│  LocalStack (Docker) │──S3──▸│  Lambda Fn   │
│  (Vite)    │ PUT   │  localhost:4566      │ event │  handler.js  │
└────────────┘       └─────────────────────┘       └──────────────┘
       ▲                        ▲
       │                        │
       └──── Playwright ────────┘
              (E2E tests)
```

## Prerequisites

| Tool              | Version  |
| ----------------- | -------- |
| Node.js           | >= 18    |
| Docker & Compose  | Latest   |
| AWS CLI (optional)| v2       |

## Quick Start

```bash
# 1. Install root dependencies
npm install

# 2. Install frontend and backend dependencies
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 3. One-command demo (starts LocalStack, deploys Lambda, launches UI, runs tests)
npm run demo
```

## Project Structure

```
.
├── docker-compose.yml          # LocalStack container definition
├── package.json                # Root orchestration scripts
│
├── backend/
│   ├── handler.js              # Lambda function (S3 event processor)
│   ├── serverless.yml          # Serverless Framework config (LocalStack)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx             # Upload UI component
    │   ├── App.css             # Component styles
    │   ├── main.jsx            # React entry point
    │   └── index.css           # Global styles
    ├── tests/
    │   └── upload.spec.js      # Playwright E2E test suite
    ├── playwright.config.js    # Playwright configuration
    └── package.json
```

## Available Scripts

| Script               | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run infra:up`   | Start LocalStack Docker container                |
| `npm run infra:down` | Stop LocalStack                                  |
| `npm run setup`      | Start infra + deploy serverless backend          |
| `npm run frontend:dev`| Start Vite dev server on port 5173              |
| `npm run test:e2e`   | Run Playwright tests against running environment |
| `npm run demo`       | **Full demo**: setup → frontend → tests          |

## How It Works

1. **Docker Compose** spins up a LocalStack container exposing S3 and Lambda on `localhost:4566`.
2. **Serverless Framework** deploys a Lambda function that listens for `s3:ObjectCreated:*` events on the `university-docs` bucket.
3. The **React frontend** uses `@aws-sdk/client-s3` with `endpoint: http://localhost:4566` to upload files directly to LocalStack.
4. **Playwright** automates the browser, uploads a test file, then queries the LocalStack S3 API and CloudWatch Logs to verify the pipeline worked end-to-end.

## LocalStack Endpoint Override

All AWS SDK clients in this project use the LocalStack endpoint override:

```js
const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  forcePathStyle: true,
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
});
```

## License

MIT
