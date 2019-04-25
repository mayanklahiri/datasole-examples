const { mutations, runtime, log } = require(process.env.DATASOLE_PATH);

function main() {
  // Inform datasole that application is ready.
  runtime.signalReady();

  log.info("Application started.");

  // Keep event loop alive.
  setInterval(() => {
    runtime.sendMutations([
      mutations.setKeyPath("foo.bar", {
        time: new Date().toISOString(),
        random: Math.random()
      })
    ]);
  }, 1000);
}

if (require.main === module) {
  main();
} else {
  module.exports = main;
}
