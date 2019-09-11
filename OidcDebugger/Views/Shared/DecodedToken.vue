<template>
  <div>
    <h6>Header</h6>
    <pre>{{header}}</pre>
    <h6>Payload</h6>
    <pre>{{body}}</pre>
    <copy-button class="bottom-right" v-bind:value="combined" v-show="combined"></copy-button>
  </div>
</template>
<script>
  export default {
    props: ['value'],
    data(){
      return{
        header,
        body,
        combined
      }
    },
    methods: {
      decodeComponent(base64Url) {
        var atob = require('atob');
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.stringify(JSON.parse(atob(base64)), undefined, 3)
      }
    },
    created: function() {
        if (this.value != null) {
          this.header = this.decodeComponent(this.value.split('.')[0])
          this.body = this.decodeComponent(this.value.split('.')[1])
          this.combined = this.header + "\n" + this.body
        }
    } 
  }
</script>