<template lang="pug">
  - buildInfo = JSON.parse(BUILD)
  - config = JSON.parse(CONFIG)  

  div(class='container-fluid')
    div(class='row mt-4 mb-4')
      div(class='col')
        h1 Sample Datasole Realtime App (Vue)
        div(class='mb-3')
          strong Open this url in #[a(href='#', target='_blank') another tab] to validate synchronization.
        if MODE != 'production'
          div(class='alert alert-warning')
            h5 Development build
            div The UI will auto-update (hot) when source files are changed on disk. To build and run the production build, run #[code datasole build] and then #[code datasole run].
        
    div(class='row mb-4 mt-4')
      div(class='col col-md-3')
        h2 Connection Status
        div(class='mb-4')
          table(class='table table-bordered')
            tr
              th WebSocket endpoint
              td {{modelStatus.wsUrl}}
            tr
              th Connected
              td {{modelStatus.connected}}
            tr
              th Status
              td {{modelStatus.text}}
            tr
              th Messages recv
              td {{modelMetrics.msgsReceived}}
            tr
              th Model updates
              td {{modelMetrics.opsApplied}}
            tr
              th Average message size
              td {{modelMetrics.avgMsgSizeBytes}}

        h2 Build information
        div(class='mb-4')
          table(class='table table-bordered')
            tr
              th Build time
              td= buildInfo.time
            tr
              th Build hostname
              td= buildInfo.hostname
            tr
              th Build user
              td= buildInfo.username
            tr
              th Mode
              td= config.mode
            tr
              th Root URL
              td= config.urlRootPath
            tr
              th API Endpoint
              td= config.apiUrl

        h2 Bundled Assets
        h3 Images
        img(src='~assets/sample.jpg')

      div(class='col col-md-4')        
        h2 Model   
        foo-display
        div(class='mt-3', v-if="model")
          h3 Raw model
          pre
            code {{model}}

      div(class='col col-md-4')
        h2 API Request Log
        button(class='btn btn-primary btn-xl', type='submit', v-on:click="makeRandomRequest()")
          strong Make random API POST request
        api-request-log
</template>

<script>
const axios = require("axios").default;
import { get } from "lodash";

export default {
  methods: {
    async makeRandomRequest() {
      const apiBaseUrl = get(this.$root.$data.model, "$server.config.apiUrl");
      if (apiBaseUrl) {
        await axios.post(`${apiBaseUrl}/fn/${Math.random()}`);
      } else {
        console.warn(`No API URL in server config, ignoring.`);
      }
    }
  },
  computed: {
    model() {
      return this.$root.$data.model;
    },
    modelStatus() {
      return this.$root.$data.modelStatus;
    },
    modelMetrics() {
      return get(this.modelStatus, "metrics", {});
    }
  }
};
</script>
