function main() {
  // Inform datasole that application is ready.
  process.send({
    type: "ready"
  });

  // Keep event loop alive.
  setInterval(() => {}, 100000);
}

if (require.main === module) {
  main();
} else {
  module.exports = main;
}
