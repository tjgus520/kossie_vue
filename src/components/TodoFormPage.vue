<template>
  <div v-if="loading" class="">Loading</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label for="">Subject</label>
          <input v-model="todo.subject" type="text" class="form-control" />
        </div>
        <div v-if="subjectError" class="text_pink">{{ subjectError }}</div>
      </div>
      <div v-if="editing" class="col-6">
        <div class="form-group">
          <label for="">Status</label>
          <div class="">
            <button type="button" class="btn" :class="todo.completed ? 'btn-success' : 'btn-danger'" @click="toggleTodoStatus">
              {{ todo.completed ? "completed" : "Imcompleted" }}
            </button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label for="">Body</label>
          <textarea v-model="todo.body" class="form-control" id="" cols="30" rows="10"></textarea>
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">{{ editing ? "업데이트" : "새로 만들기" }}</button>
    <button class="btn btn-outline-dark ml-2" @click="moveToTodoListPage">취소</button>
  </form>
  <transition name="fade">
    <Toast v-if="showToast" :message="toastMessage" :type="toastAlertType" />
  </transition>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import _ from "lodash";
import { useToast } from "@/composables/toast.js";
import Toast from "@/components/ToastPage.vue"; // Toast 컴포넌트의 경로에 맞게 수정

export default {
  components: {
    Toast,
  },
  props: {
    editing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: "",
      completed: false,
      body: "",
    });
    const subjectError = ref("");
    const originalTodo = ref(null);
    const loading = ref(false);
    // const showToast = ref(false);
    // const toastMessage = ref("");
    // const toastAlertType = ref("");
    const todoID = route.params.id;

    //언마운티드는 메모리를 정리할때 유용하게 쓰임

    const getTodo = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`http://localhost:3000/todos/${todoID}`);

        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
        loading.value = false;
      } catch (error) {
        loading.value = false;
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

    const { toastMessage, toastAlertType, showToast, triggerToast } = useToast();
    // const triggerToast = (message, type = "success") => {
    //   showToast.value = true;
    //   toastMessage.value = message;
    //   toastAlertType.value = type;

    //   timeOut.value = setTimeout(() => {
    //     toastMessage.value = "";
    //     toastAlertType.value = "";
    //     showToast.value = false;
    //   }, 3000);
    // };
    if (props.editing) {
      getTodo(); // 최초에 할 일 항목을 가져오는 부분을 추가
    }

    const onSave = async () => {
      subjectError.value = "";
      if (!todo.value.subject) {
        subjectError.value = "Subject is required";
        return;
      }

      try {
        let res;
        const data = {
          subject: todo.value.subject,
          completed: todo.value.completed,
          body: todo.value.body,
        };
        if (props.editing) {
          res = await axios.put(`http://localhost:3000/todos/${todoID}`, data);
          originalTodo.value = { ...res.data };
        } else {
          res = await axios.post(`http://localhost:3000/todos`, data);
          todo.value.subject = "";
          todo.value.body = "";
        }

        // console.log(res);
        originalTodo.value = { ...res.data };
        const message = "Successfully" + (props.editing ? " Updated!" : " Created!");
        triggerToast(message);
        // getTodo();
      } catch (error) {
        console.log(error);
        triggerToast("Something went wrong", "danger");
      }
    };

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
      subjectError,
    };
  },
};
</script>

<style scoped>
.text_pink {
  color: pink;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>
