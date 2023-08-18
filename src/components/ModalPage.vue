<template>
  <div class="modal_wrapper" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fs-5"><slot name="title"></slot></h5>
          <button type="button" class="btn-close" @click="onClose">X</button>
        </div>
        <div class="modal-body"><slot name="body"></slot></div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {
    const onClose = () => {
      emit("close");
    };
    // const onDelete = () => {
    //   emit("delete");
    // };
    return {
      onClose,
      //   onDelete,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
</style>
