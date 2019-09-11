<template>
  <div class="card card-body code-block">
    <div class="card-text white-text">
      <div style="display:block" ref="encoded">
          {{value}}
          <copy-button class="bottom-right" v-bind:value="value" v-show="value"></copy-button>
      </div>
      <decoded-token style="display:none" v-bind:value="value" ref="decoded"></decoded-token>
    </div>
    <button type="button" title="Decode"
          class="btn btn-primary btn-sm bottom-left"
          v-on:click='showDecoded()'>
      <i class="fa fa-code" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    showDecoded(){
      if (this.$refs.decoded.$el.style.display === "none") {
        this.$refs.encoded.style.display = "none";
        this.$refs.decoded.$el.style.display = "block";
      } else {
        this.$refs.encoded.style.display = "block";
        this.$refs.decoded.$el.style.display = "none";
      }
    }
  }
}
</script>
