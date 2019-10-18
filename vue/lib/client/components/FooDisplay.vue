<template lang="pug">
    div(class='FooDisplay')
        div(class='mt-2')
            h3 Synchronized random number
            div(class='bold-display', v-if="fooBar") {{fooBar.random}}

        div(class='mt-3')
            h3 Last synchronized
            div(class='bold-display', v-if="fooBar") {{fooBar.time}}        
</template>

<script>
import { get } from "lodash";
export default {
  computed: {
    fooBar() {
      return get(this.$root.$data.model, "foo.bar");
    }
  }
};
</script>

<style lang="scss" scoped>
$GRAY: #888;

.FooDisplay {
  .bold-display {
    font-family: "monospace";
    text-align: left;
    display: block;
    font-weight: bold;
    color: $GRAY;
    font-size: 30px;
  }
}
</style>