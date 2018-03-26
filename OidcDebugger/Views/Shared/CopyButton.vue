<template>
    <button type="button" title="Copy"
            class="btn btn-primary btn-sm"
            v-clipboard:copy="value">
        <i class="fa fa-clipboard" aria-hidden="true"></i>
    </button>
</template>

<script>
  export default {
    props: ['value']
  }
</script>
