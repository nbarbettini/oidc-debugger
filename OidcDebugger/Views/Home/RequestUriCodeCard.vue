<template>
  <div class="card card-body code-block">
    <p id="generatedUri" class="card-text white-text debug__form--output">
      <template v-if="hasAuthorizeUri">
        <span class="code-line light-blue-text">{{uriObject.authorizeUri}}</span>
        <template v-for="(param, index) in uriObject.params">
          <span class="code-line code-line-param">
            {{index === 0 ? '?' : '&amp;'}}{{param.name}}=<span class="light-blue-text">{{param.value}}</span>
          </span>
        </template>
      </template>
       
      <copy-button class="bottom-right" 
                   v-bind:value="uriObject.encodedUri"
                   v-bind:class="{ disabled: !uriObject.valid }"
                   v-if="hasAuthorizeUri">
      </copy-button>
    </p>
  </div>
</template>

<script>
  export default {
    props: ['uriObject'],
    computed: {
      hasAuthorizeUri: function() {
        return this.uriObject && this.uriObject.authorizeUri;
      }
    }
  }
</script>
