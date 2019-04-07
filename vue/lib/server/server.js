const { runtime } = require(process.env.DS_RUNTIME);

function main() {
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
