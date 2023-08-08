<template>
  <!-- <div v-show="toggle" class="">true</div>
  <div v-show="!toggle" class="">false</div>
  <button @click="onToggle" class="btn btn-primary">토글</button> -->
  <div class="container">
    <h2>To-Do List</h2>
    <input type="text" v-model="searchText" class="form-control" placeholder="Search" />
    <hr />
    <TodoSimpleForm @add-todo="addTodo" />
    <div class="" style="color: hotPink">{{ error }}</div>
    <div v-if="!filteredTodos.length">추가된 Todo가 없습니다</div>
    <TodoList :todos="filteredTodos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" />
    <hr />
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#">Previous</a></li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
      </ul>
    </nav>
    <!-- todos 보내주기  -->
  </div>
</template>

<script>
import { computed, ref } from "vue";
import TodoSimpleForm from "./components/TodoSimpliForm.vue";
import TodoList from "./components/TodoList.vue";
import axios from "axios";

export default {
  components: {
    TodoSimpleForm,
    TodoList,
  },

  setup() {
    // const toggle = ref(false);

    const todos = ref([
      //   { id: 1, subject: "옷걸이사기" },
      //   { id: 2, subject: "운동가기" },
    ]);
    // const todoStyle = {
    //   textDecoration: "line-through",
    //   color: "pink",
    // };
    const error = ref("");
    const getTodos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/todos?_page=1&_limit=5");
        todos.value = res.data;
      } catch (err) {
        console.log(err);
        error.value = "Sometihing went wrong";
      }
    };
    getTodos();
    const addTodo = async (todo) => {
      //데이터 베이스에 투두를 저장해주기
      error.value = "";
      try {
        const res = await axios.post("http://localhost:3000/todos", {
          subject: todo.subject,
          completed: todo.completed,
        });
        todos.value.push(res.data);
      } catch (err) {
        error.value = "Sometihing went wrong";
        console.log(err);
      }

      // 위의 요청이 끝난 다음 실행하아 then -> 없으면 다 끝났는지 아닌지도 모르고 실행해버림

      //   if (todo.value === "") {
      //     hasErorr.value = true;
      //   } else {
      //     console.log(todo.value);
      //     todos.value.push({
      //       id: Date.now(),
      //       subject: todo.value,
      //       completed: false,
      //     });
      //     hasErorr.value = false;
      //     todo.value = "";
      //   }
    };
    // const hasErorr = ref(false);
    // const onToggle = () => {
    //   toggle.value = !toggle.value;
    // };
    const toggleTodo = async (index) => {
      error.value = "";
      const id = todos.value[index].id;
      try {
        await axios.patch("http://localhost:3000/todos/" + id, { completed: !todos.value[index].completed });

        todos.value[index].completed = !todos.value[index].completed;
      } catch (err) {
        console.log(err);
        error.value = "Sometihing went wrong";
      }
    };

    const deleteTodo = async (index) => {
      const id = todos.value[index].id;
      try {
        await axios.delete("http://localhost:3000/todos/" + id);
        todos.value.splice(index, 1);
        console.log("deleteTodo");
        error.value = "";
      } catch (err) {
        console.log(err);
        error.value = "Sometihing went wrong";
      }
    };
    const searchText = ref("");
    const filteredTodos = computed(() => {
      if (searchText.value) {
        return todos.value.filter((todo) => {
          return todo.subject.includes(searchText.value);
        });
      }
      return todos.value;
    });
    return {
      todos,
      addTodo,
      //   toggle,
      //   onToggle,
      searchText,
      filteredTodos,
      error,
      //   res,
      //   todoStyle,
      deleteTodo,
      toggleTodo,
      getTodos,
    };
  },
};
</script>

<style>
.name {
  font-size: 40px;
}
.todo {
  color: rgba(242, 120, 210, 0.857);
  text-decoration-line: line-through;
}
</style>
