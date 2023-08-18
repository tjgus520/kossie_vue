<template>
  <div class="card mt-2" v-for="(todo, index) in todos" :key="todo.id">
    <div class="card-body p-2 d-flex align-item-center" style="cursor: pointer" @click="movoToPage(todo.id)">
      <div class="flex-grow-1">
        <input class="ml-2 mr-2" type="checkbox" :checked="todo.completed" @change="toggleTodo(index, $event)" @click.stop />
        <span class="form-check-label" :class="{ todo: todo.completed }">{{ todos[index].subject }}</span>
        <!-- <label class="form-check-label" :style="todo.completed ? todoStyle : {}"> {{ todos[i].subject }}</label> -->
      </div>
      <div class="">
        <button @click.stop="openModal(todo.id)" class="btn btn-danger btn-sm">Delete</button>
      </div>
    </div>
  </div>

  <teleport to="#modal">
    <modal v-if="showModal" @close="closeModal" @delete="deleteTodo" />

    <!-- <template v-slot:title>타이틀 데스</template>
      <template v-slot:body>진짜 삭제할거임?</template>
      <template v-slot:footer><button>이건 뭐지</button></template> -->
    <!-- 컴포넌트 부르는 태그 사이에 넣은 글이  모달 페이지의 slot에 있는 글자로 대체되서 보이게 된다...??
      버튼같은 엘리먼트도 넣기 가넝-->
    <!-- </modal> -->
  </teleport>

  <!-- 보통 최상위에 위치해야하는 모달이나 알림 팝업 등을 텔레포트 시킴 //사실 뭐가 좋은지 잘 모를...... -->
</template>

<script>
import { ref } from "vue";
import { watchEffect } from "vue";
import { useRouter } from "vue-router";
import modal from "@/components/DeleteModal.vue";

export default {
  //  props: ["todos"], todos props로 받기
  components: {
    modal,
  },
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },

  emits: ["toggle-todo", "delete-todo"],
  setup(props, { emit }) {
    const showModal = ref(false);
    const todoDeleteId = ref(null);
    const router = useRouter();
    watchEffect(() => {
      //   console.log(props.todos.length);
    });
    const toggleTodo = (index, event) => {
      emit("toggle-todo", index, event.target.checked); //이름이랑 같이 보내기
    };
    const openModal = (id) => {
      todoDeleteId.value = id;
      showModal.value = true;
    };
    const closeModal = (id) => {
      todoDeleteId.value = null;
      showModal.value = false;
    };

    const deleteTodo = () => {
      emit("delete-todo", todoDeleteId.value);
      showModal.value = false;
      todoDeleteId.value = null;
    };
    const movoToPage = (todoId) => {
      console.log(todoId);
      //   router.push("/todos/" + todoId);
      router.push({ name: "Todo", params: { id: todoId } });
    };

    return {
      toggleTodo,
      deleteTodo,
      movoToPage,
      showModal,
      openModal,
      closeModal,
    };
  },
};
</script>

<style></style>
