<template>
  <form>
    <div class="form-group">
      <label for="remoteFnName">Remote function name</label>
      <input
        v-model="remoteFnName.value"
        v-bind:class="{'is-valid': remoteFnName.validated, 'is-invalid': remoteFnName.error}"
        v-bind:disabled="form.status!=='enabled'"
        type="text"
        class="form-control"
        id="remoteFnName"
        placeholder
      >
      <div class="valid-feedback" v-if="remoteFnName.validated">Valid name!</div>
      <div class="invalid-feedback" v-if="remoteFnName.error">{{remoteFnName.error}}</div>
    </div>
    <div class="form-group">
      <label for="remoteFnArgs">Remote function arguments (as JSON)</label>
      <textarea
        rows="10"
        class="form-control"
        id="remoteFnArgs"
        v-bind:disabled="form.status!=='enabled'"
        v-bind:class="{'is-valid': remoteFnArgs.validated, 'is-invalid': remoteFnArgs.error}"
        v-model="remoteFnArgs.value"
      ></textarea>
      <div class="valid-feedback" v-if="remoteFnArgs.validated">Valid JSON!</div>
      <div class="invalid-feedback" v-if="remoteFnArgs.error">{{remoteFnArgs.error}}</div>
    </div>

    <button
      type="submit"
      class="btn btn-primary"
      v-if="form.status === 'enabled'"
      v-bind:disabled="form.status !== 'enabled'"
      v-on:click="execute()"
    >Execute</button>

    <span v-if="form.status !== 'enabled'">
      <img class="spinner" src="~Assets/spinner.svg">
      <span>{{form.status}}</span>
    </span>
    <span
      class="light-text"
      v-if="form.status == 'enabled' && form.meta"
    >Executed in {{form.meta.elapsedTimeMs}} ms.</span>

    <div
      class="result-box"
      v-bind:class="{'alert-info': form.result && !form.error, 'alert-danger': form.error}"
    >
      <div v-if="form.error">
        <h3>Error</h3>
        <pre><code>{{form.error}}</code></pre>
      </div>
      <div v-if="form.result">
        <h3>Result</h3>
        <pre><code>{{form.result}}</code></pre>
        <div class="metadata" v-if="form.meta">
          <h4>Metadata</h4>
          <pre><code>{{form.meta}}</code></pre>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        status: "enabled",
        error: null,
        result: null,
        meta: null
      },
      remoteFnName: {
        validated: false,
        error: null,
        value: "whoami"
      },
      remoteFnArgs: {
        validated: false,
        error: null,
        value: "{}"
      }
    };
  },
  methods: {
    execute: function() {
      const { remoteFnArgs, remoteFnName } = this.$data;
      remoteFnName.value = (remoteFnName.value || "").replace(
        /[^0-9A-Za-z_\/\-]/gim,
        ""
      );
      if (remoteFnName.value.length < 1) {
        remoteFnName.validated = false;
        remoteFnName.error = "Please enter a remote function name.";
      } else {
        remoteFnName.validated = true;
        remoteFnName.error = null;
      }

      let remoteFnArgsValue;
      try {
        if ((remoteFnArgs.value || "").length < 2) {
          throw new Error(
            "Please enter an arguments object as a JSON-encoded string."
          );
        }
        remoteFnArgsValue = JSON.parse(remoteFnArgs.value);
        remoteFnArgs.validated = true;
        remoteFnArgs.error = null;
      } catch (e) {
        remoteFnArgs.validated = false;
        remoteFnArgs.error = `Cannot parse text as JSON: ${e.message}`;
      }

      if (remoteFnArgs.validated && remoteFnName.validated) {
        // Form validated.
        this.$data.form.status = "Request sent, waiting for response...";
        this.$root.$data.liveModelClient
          .invokeRpc(remoteFnName.value, remoteFnArgsValue)
          .then(({ result, meta }) => {
            Object.assign(this.$data.form, {
              error: false,
              status: "enabled",
              result,
              meta
            });
          })
          .catch(error => {
            Object.assign(this.$data.form, {
              error,
              status: "enabled",
              result: null
            });
          });
      }
    }
  }
};
</script>

<style lang="scss">
.result-box {
  margin: 20px 0 10px 0;
  padding: 10px;

  h3 {
    font-size: 24px;
  }

  h4 {
    font-size: 18px;
    margin-top: 10px;
  }

  pre {
    margin: 0;

    code {
      font-size: 16px;
    }
  }
}

input[type="text"],
.form-control {
  font-family: "monospace";
}
</style>