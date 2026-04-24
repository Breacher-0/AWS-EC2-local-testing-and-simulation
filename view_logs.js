const { CloudWatchLogsClient, DescribeLogStreamsCommand, GetLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");

const client = new CloudWatchLogsClient({
  endpoint: "http://127.0.0.1:4566",
  region: "us-east-1",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

const logGroupName = "/aws/lambda/cloud-simulation-backend-local-processUpload";

async function viewLogs() {
  try {
    // 1. Get the latest log stream
    const streams = await client.send(new DescribeLogStreamsCommand({
      logGroupName,
      orderBy: "LastEventTime",
      descending: true,
      limit: 1
    }));

    if (!streams.logStreams || streams.logStreams.length === 0) {
      console.log("No logs found yet. Make sure you have uploaded a file!");
      return;
    }

    const streamName = streams.logStreams[0].logStreamName;

    // 2. Get the events
    const events = await client.send(new GetLogEventsCommand({
      logGroupName,
      logStreamName: streamName,
      limit: 10
    }));

    console.log("\n--- 📄 CLOUD SIMULATION LOGS ---");
    events.events.forEach(event => {
      console.log(`[${new Date(event.timestamp).toLocaleTimeString()}] ${event.message.trim()}`);
    });
    console.log("-------------------------------\n");

  } catch (err) {
    if (err.name === 'ResourceNotFoundException') {
        console.log("No logs found. The Lambda hasn't run yet!");
    } else {
        console.error("Error fetching logs:", err.message);
    }
  }
}

viewLogs();
