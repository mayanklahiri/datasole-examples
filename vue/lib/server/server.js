const { mutations, runtime, log } = require(process.env.DATASOLE_PATH);

const API_REQUEST_LOG_LIMIT_ITEMS = 10;

function main() {
  // Logging implementation and configuration comes from parent runtime.
  log.info("Application starting.");

  // WebSocket authentication handler.
  // Throw an error with the HTTP 'code' property to reject the WebSocket upgrade request.
  runtime.registerWsAuthHandler(async wsAuthRequest => {
    const { clientId, remoteIp } = wsAuthRequest;
    log.info(`WebSocket auth request from IP ${remoteIp}, client ${clientId}`);

    // Random WebSocket auth failures, for testing.
    // DO NOT INCLUDE IN PRODUCTION CODE.
    if (Math.random() < 0.1) {
      log.warn(`TEST ONLY: randomly refusing client ${clientId}`);
      throw new Error(`Random refusal group, please try again.`);
    }
  });

  // HTTP API handler (singleton function).
  runtime.setApiHandler(async apiRequest => {
    // Add details about the API Request to a circular list in the shared model.
    const {
      remoteIp,
      path: apiPath,
      reqId,
      method,
      headers,
      body,
      time
    } = apiRequest;
    runtime.sendMutations([
      mutations.circularAppendKeyPath(
        "recent_api_requests",
        {
          time,
          reqId,
          remoteIp,
          apiPath,
          method,
          body,
          headers
        },
        API_REQUEST_LOG_LIMIT_ITEMS
      )
    ]);

    // Echo the API request back as the response (development/demo only).
    return {
      time: Date.now(),
      backend: {
        pid: process.pid
      },
      apiRequest
    };
  });

  // Clear out shared model in parent runtime and set arbitrary initial state.
  runtime.sendMutations([
    // mutations.clearAll(),
    mutations.setKeyPath("app_info", {
      pid: process.pid,
      cwd: process.cwd(),
      argv: process.argv
    })
  ]);

  // Send periodic updates to the shared model for a synchronized heartbeat.
  setInterval(() => {
    runtime.sendMutations([
      mutations.setKeyPath("foo.bar", {
        time: new Date().toISOString(),
        random: Math.random()
      })
    ]);
  }, 5000);

  // Inform parent runtime that application is ready.
  runtime.signalReady();
}

if (require.main === module) {
  main();
} else {
  module.exports = main;
}
