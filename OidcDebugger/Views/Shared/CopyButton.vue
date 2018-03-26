<template>
  <button type="button" title="Copy"
          class="btn btn-primary btn-sm"
          v-clipboard:copy="value">
    <i class="fa fa-clipboard" aria-hidden="true"></i>
  </button>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

export default {
  props: ['value']
}
</script>
