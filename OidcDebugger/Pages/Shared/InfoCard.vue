<template>
  <div class="debug__content"> 
    <div class="card" :class="cardcls">
      <div class="card-header">
        <h5>
          <i class="fa fa-info-circle" aria-hidden="true"></i>
          <strong>{{title}}</strong>
        </h5>
      </div>
      <div class="card-body text-center">
        <p class="card-text">
          <slot></slot>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'cardcls']
}
</script>
