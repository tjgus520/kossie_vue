<template>
  <Modal>
    <template v-slot:title>딜리트타이틀 데스</template>
    <template v-slot:body>진짜 삭제할거임?</template>
    <template v-slot:footer> <button type="button" class="btn btn-secondary" @click="onClose">Close</button> <button type="button" class="btn btn-danger" @click="onDelete">Delete</button></template>
    <!-- 컴포넌트 부르는 태그 사이에 넣은 글이  모달 페이지의 slot에 있는 글자로 대체되서 보이게 된다...??
      버튼같은 엘리먼트도 넣기 가넝-->
  </Modal>
</template>

<script>
import Modal from "@/components/ModalPage.vue";
export default {
  components: {
    Modal,
  },
  setup(props, { emit }) {
    const onClose = () => {
      emit("close");
    };
    const onDelete = () => {
      emit("delete");
    };
    return {
      onClose,
      onDelete,
    };
  },
};
</script>

<style lang="scss" scoped></style>
