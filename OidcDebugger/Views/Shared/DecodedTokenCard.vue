<template>
    <div class="card card-body code-block" v-if="valid">
        <p class="card-text white-text">
            Header
        </p>
        <pre class="card-text white-text">{{header}}</pre>
        <p class="card-text white-text">
            Payload
        </p>
        <pre class="card-text white-text">{{payload}}</pre>
        <copy-button class="bottom-right" v-bind:value="payload" v-show="valid" title="Copy payload"></copy-button>
    </div>
</template>
<script>
  export default {
        props: ['value'],
        computed: {
            valid: function() { return this.value && this.value.split('.').length === 3; },
            header: function() { return this.decodeComponent(this.value.split('.')[0]); },
            payload: function() { return this.decodeComponent(this.value.split('.')[1]); }
        },
        methods: {
            decodeComponent(base64Url) {
                var atob = require('atob');
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.stringify(JSON.parse(atob(base64)), undefined, 3)
            }
        }
  }
</script>