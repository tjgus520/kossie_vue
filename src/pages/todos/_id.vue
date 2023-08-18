<template>
  <h1 class="text_pink">To-Do Page</h1>
  <TodoForm :editing="true" />
</template>

<script>
// import { ref, computed } from "vue";
// import { useRoute, useRouter } from "vue-router";
// import axios from "axios";
// import _ from "lodash";
// import { useToast } from "@/composables/toast.js";
// import Toast from "@/components/ToastPage.vue"; // Toast 컴포넌트의 경로에 맞게 수정
import TodoForm from "@/components/TodoFormPage.vue";

export default {
  components: {
    // Toast,
    TodoForm,
  },
  setup() {},
};
</script>

<style lang="scss" scoped></style>
