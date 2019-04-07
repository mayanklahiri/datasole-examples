<template lang="pug">
  div(class='container-fluid')
    div(class='row')
      div(class='col')
        h1 Skeleton Datasole Realtime App using Vue
        p Uses: Vue, vue-router, Bootstrap
    div(class='row')
      div(class='col col-md-4')
        pre
          code Build information = 
          code= BUILD
        pre
          code Build configuration = 
          code= CONFIG
      div(class='col  col-md-4')
        pre
          code Model = 
          code {{this.$root.$data.model}}
      div(class='col  col-md-4')
        pre
          code Model status = 
          code {{this.$root.$data.modelStatus}}
</template>
