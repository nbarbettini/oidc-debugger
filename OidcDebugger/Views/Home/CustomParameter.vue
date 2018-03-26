<template>
  <div class="row d-flex align-items-center">
    <div class="col">
      <div class="md-form">
        <label for="custom-key">Key</label>
        <input type="text"
               id="custom-key"
               v-model="key"
               v-on:input="update()"></input>
      </div>
    </div>
    <div class="col">
      <div class="md-form">
        <label for="custom-value">Value</label>
        <input type="text"
               id="custom-value"
               v-model="val"
               v-on:input="update()"></input>
      </div>
    </div>
    <i class="fa fa-close fa-lg grey-text"
       v-on:remove="customParameters.splice(index, 1)"></i>
  </div>
</template>

<script>
  export default {
    props: ['value'],
    data: function() {
      return {
        key: this.value.key,
        val: this.value.value
      }
    },
    methods: {
      update: function() {
        this.$emit('input', { key: this.key, value: this.val})
      }
    }
  }
</script>
