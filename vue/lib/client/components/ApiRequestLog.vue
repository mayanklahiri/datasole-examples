<template lang="pug">
  div(class='ApiRequestLog')
    div(class='mt-2 mb-3', v-if="serverConf && serverConf.apiUrl") 
      span API URL: 
      a(v-bind:href="serverConf.apiUrl", target="_blank") {{serverConf.apiUrl}}
    div(class='mt-3 mb-3')
      table(class='table table-striped')
        thead
          tr
            th Time
            th Method
            th Path
            th IP
        tbody
          tr(v-for="req in apiRequests")
            td {{req.time}}
            td {{req.method}}
            td {{req.apiPath}}
            td {{req.remoteIp}}
</template>

<script>
import { get } from "lodash";
export default {
  computed: {
    apiRequests() {
      return get(this.$root.$data.model, "recent_api_requests", []);
    },
    serverConf() {
      return get(this.$root.$data.model, "$server.config", {});
    }
  }
};
</script>
