const { runtime, log } = require(process.env.DATASOLE_PATH);

function main() {
  log.info("Hello, world!");

  // Inform datasole that application is ready.
  runtime.signalReady();

  // Keep event loop alive.
  setInterval(() => {}, 100000);
}

if (require.main === module) {
  main();
} else {
  module.exports = main;
}
