<template>
  <h1>To-Do Page</h1>
  <div v-if="loading" class="">Loading</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label for="">Subject</label>
          <input v-model="todo.subject" type="text" class="form-control" />
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label for="">Status</label>
          <div class="">
            <button type="button" class="btn" :class="todo.completed ? 'btn-success' : 'btn-danger'" @click="toggleTodoStatus">
              {{ todo.completed ? "completed" : "Imcompleted" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">저장</button>
    <button class="btn btn-outline-dark ml-2" @click="moveToTodoListPage">취소</button>
  </form>
  <Toast v-if="showToast" :message="toastMessage" :type="toastAlertType" />
</template>

<script>
import { ref, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import _ from "lodash";

import Toast from "@/components/ToastPage.vue"; // Toast 컴포넌트의 경로에 맞게 수정

export default {
  components: {
    Toast,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const todo = ref(null);
    const originalTodo = ref(null);
    const loading = ref(true);
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastAlertType = ref("");
    const todoID = route.params.id;
    const timeOut = ref("null");
    //언마운티드는 메모리를 정리할때 유용하게 쓰임
    onUnmounted(() => {
      console.log("언마운티드");
      clearTimeout(timeOut.value);
    });

    const getTodo = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/todos/${todoID}`);

        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
        loading.value = false;
      } catch (error) {
        console.log(error);
        triggerToast("Something went wrong", "danger");
      }
    };

    const todoUpdated = computed(() => {
      return !_.isEqual(todo.value, originalTodo.value);
    });

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed;
    };

    const moveToTodoListPage = () => {
      router.push({
        name: "Todos",
      });
    };

    const triggerToast = (message, type = "success") => {
      showToast.value = true;
      toastMessage.value = message;
      toastAlertType.value = type;

      timeOut.value = setTimeout(() => {
        toastMessage.value = "";
        toastAlertType.value = "";
        showToast.value = false;
      }, 3000);
    };

    const onSave = async () => {
      try {
        const res = await axios.put(`http://localhost:3000/todos/${todoID}`, {
          subject: todo.value.subject,
          completed: todo.value.completed,
        });
        console.log(res);
        originalTodo.value = { ...res.data };
        triggerToast("Successfully saved!");
        getTodo();
      } catch (error) {
        console.log(error);
        triggerToast("Something went wrong", "danger");
      }
    };

    getTodo(); // 최초에 할 일 항목을 가져오는 부분을 추가

    return {
      todo,
      loading,
      toggleTodoStatus,
      moveToTodoListPage,
      onSave,
      todoUpdated,
      showToast,
      toastMessage,
      toastAlertType,
    };
  },
};
</script>

<style lang="scss" scoped></style>
