const { S3Client, PutBucketCorsCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({
  endpoint: "http://127.0.0.1:4566",
  region: "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

async function run() {
  try {
    await client.send(
      new PutBucketCorsCommand({
        Bucket: "university-docs",
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedHeaders: [
                "*",
                "x-amz-sdk-checksum-algorithm",
                "x-amz-user-agent",
                "x-amz-content-sha256",
                "x-amz-date",
                "authorization",
                "content-type"
              ],
              AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
              AllowedOrigins: ["*"],
              ExposeHeaders: ["x-amz-sdk-checksum-algorithm"],
              MaxAgeSeconds: 3000,
            },
          ],
        },
      })
    );
    console.log("Success: Explicit CORS policy applied!");
  } catch (err) {
    console.error("Error applying CORS:", err);
  }
}

run();
