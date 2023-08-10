<template>
  <div class="card mt-2" v-for="(todo, index) in todos" :key="todo.id">
    <div class="card-body p-2 d-flex align-item-center" style="cursor: pointer" @click="movoToPage(todo.id)">
      <div class="form-check flex-grow-1">
        <input class="form-check-input" type="checkbox" :checked="todo.completed" @change="toggleTodo(index, $event)" @click.stop />
        <label class="form-check-label" :class="{ todo: todo.completed }"> {{ todos[index].subject }}</label>
        <!-- <label class="form-check-label" :style="todo.completed ? todoStyle : {}"> {{ todos[i].subject }}</label> -->
      </div>
      <div class="">
        <button @click.stop="deleteTodo(index)" class="btn btn-danger btn-sm">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { watchEffect } from "vue";
import { useRouter } from "vue-router";

export default {
  //  props: ["todos"], todos props로 받기
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },

  emits: ["toggle-todo", "delete-todo"],
  setup(props, { emit }) {
    const router = useRouter();
    watchEffect(() => {
      //   console.log(props.todos.length);
    });
    const toggleTodo = (index, event) => {
      emit("toggle-todo", index, event.target.checked); //이름이랑 같이 보내기
    };
    const deleteTodo = (index) => {
      emit("delete-todo", index);
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
    };
  },
};
</script>

<style></style>
