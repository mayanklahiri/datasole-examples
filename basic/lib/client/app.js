/**
 * Client-side (browser) application entry point.
 */
import "./styles/global.scss";
import { LiveModelClient } from "live-model/client";

const PRODUCTION = CONFIG.mode === "production"; // CONFIG is injected by Webpack at build time

function main() {
  if (!PRODUCTION) {
    console.warn("Running in development mode.");
  }
  const liveModelClient = new LiveModelClient();
  liveModelClient.on("update", () => {
    const modelJson = JSON.stringify(liveModelClient.getModel(), null, 2);
    document.getElementById("data-console").textContent = modelJson;
  });

  // Initiate connection.
  liveModelClient.connect();
}

// Enable Webpack HMR in development mode.
if (module.hot && !PRODUCTION) {
  module.hot.accept();
}

main();
