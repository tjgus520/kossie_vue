<template>
  <div class="alert toast_box" role="alert" :class="`alert-${type}`">{{ message }}</div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      defult: "success",
    },
  },
};
</script>

<style lang="scss" scoped>
.toast_box {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
