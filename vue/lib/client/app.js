/**
 * Client-side (browser) application entry point.
 */
import Vue from "vue";
import VueRouter from "vue-router";
import DatasoleClient from "datasole-client";

import "bootstrap";
import "./styles/global.scss";

import routes from "./routes";
import components from "./components";

const PRODUCTION = CONFIG.mode === "production"; // CONFIG is injected by Webpack at build time

function main() {
  if (!PRODUCTION) {
    console.warn("Running in development mode.");
  }

  // Use vue-router
  Vue.use(VueRouter);
  const router = new VueRouter({ routes });

  // Change document.title on route changes.
  router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title;
    }
    next();
  });

  // Register child components.
  for (let instName in components) {
    const inst = components[instName];
    Vue.component(instName, inst);
  }

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
  const client = new DatasoleClient();
  client.on("update", () => {
    data.model = client.getModel();
    data.modelStatus = client.getModelStatus();
  });
  client.on("error", console.error);

  // Initiate Websocket connection loop to server.
  client.connect();
}

// Enable Webpack HMR in development mode.
if (module.hot && !PRODUCTION) {
  module.hot.accept();
}

main();
