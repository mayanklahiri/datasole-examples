const { mutations, runtime, log } = require(process.env.DATASOLE_PATH);

function main() {
  log.info("Application starting.");

  runtime.sendMutations([
    mutations.clearAll(),
    mutations.setKeyPath("app_info", {
      pid: process.pid,
      cwd: process.cwd(),
      argv: process.argv
    })
  ]);

  // Keep event loop alive.
  setInterval(() => {
    runtime.sendMutations([
      mutations.setKeyPath("foo.bar", {
        time: new Date().toISOString(),
        random: Math.random()
      })
    ]);
  }, 1000);

  // Inform datasole that application is ready.
  runtime.signalReady();
}

if (require.main === module) {
  main();
} else {
  module.exports = main;
}
