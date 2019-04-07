/**
 * Client-side (browser) application entry point.
 */
import Vue from "vue";
import VueRouter from "vue-router";
import { LiveModelClient } from "live-model/client";

import "bootstrap";
import "./styles/global.scss";

import routes from "./routes";

const PRODUCTION = CONFIG.mode === "production"; // CONFIG is injected by Webpack at build time

function main() {
  if (!PRODUCTION) {
    console.warn("Running in development mode.");
  }

  // Use vue-router
  Vue.use(VueRouter);
  const router = new VueRouter({ routes });

  // Create app data model.
  const data = {
    model: {},
    modelStatus: {}
  };

  // Start Vue app.
  new Vue({
    router,
    data
  }).$mount("#app");

  // Create shared data model and update Vue on updates.
  const liveModelClient = new LiveModelClient();

  liveModelClient.on("update", () => {
    data.model = Object.assign({}, data.model, liveModelClient.getModel());
    data.modelStatus = Object.assign(
      {},
      data.modelStatus,
      liveModelClient.getModelStatus()
    );
  });

  // Initiate connection.
  liveModelClient.connect();
}

// Enable Webpack HMR in development mode.
if (module.hot && !PRODUCTION) {
  module.hot.accept();
}

main();
