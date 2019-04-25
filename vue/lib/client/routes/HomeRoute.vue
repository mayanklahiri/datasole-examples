<template lang="pug">
  div(class='container-fluid')
    div(class='row')
      div(class='col')
        h1 Skeleton Datasole Realtime App using Vue
        p Open this url in #[a(href='/', target='_blank') another tab] to validate synchronization.
        if MODE == 'production'
          div(class='alert alert-info')
            strong This is a static production build.&nbsp;
            span The UI will not automatically update when source files are changed on disk. To run in development, run #[code datasole dev].
        else
          div(class='alert alert-warning')
            strong This is a development build. 
            span The UI will refresh when source files are changed on disk. To build and run the production build, run #[code datasole build] and then #[code datasole run].
        
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
        img(src='~assets/sample.jpg')
</template>
