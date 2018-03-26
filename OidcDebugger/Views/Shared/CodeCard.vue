<template>
  <div class="card card-body code-block">
    <p class="card-text white-text">
      <slot></slot>
      <copy-button class="bottom-right" v-bind:value="value" v-show="value"></copy-button>
    </p>
  </div>
</template>

<script>
export default {
  props: ['value'] 
}
</script>
