<template>
  <!-- <div v-show="toggle" class="">true</div>
  <div v-show="!toggle" class="">false</div>
  <button @click="onToggle" class="btn btn-primary">토글</button> -->
  <div class="">
    <div class="d-flex justify-content-between mt-3 mb-3">
      <h2>To-Do List</h2>
      <button class="btn btn-primary" @click="moveToCreatePage">Crsate Todo</button>
    </div>
    <div>
      <input type="text" v-model="searchText" class="form-control" placeholder="Search" @keyup.enter="searchTodo" />
      <hr />
      <!-- <TodoSimpleForm @add-todo="addTodo" /> -->
      <div class="" style="color: hotPink">{{ error }}</div>
      <div v-if="!todos.length">추가된 Todo가 없습니다</div>
      <TodoList :todos="todos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" />
      <hr />
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li v-if="currentPage !== 1" class="page-item"><a style="cursor: pointer" class="page-link" @click="getTodos(currentPage - 1)">Previous</a></li>
          <li v-for="page in numberOfPage" :key="page" class="page-item" :class="currentPage === page ? 'active' : ''">
            <a style="cursor: pointer" class="page-link" @click="getTodos(page)">{{ page }}</a>
          </li>
          <li v-if="numberOfPage !== currentPage" class="page-item" @click="getTodos(currentPage + 1)"><a class="page-link" style="cursor: pointer">Next</a></li>
        </ul>
      </nav>
      <!-- todos 보내주기  -->
    </div>
    <Toast v-if="showToast" :message="toastMessage" :type="toastAlertType" />
  </div>
</template>

<script>
import { computed, ref, watchEffect, watch } from "vue";
// import TodoSimpleForm from "@/components/TodoSimpliForm.vue";
import TodoList from "@/components/TodoList.vue";
import axios from "axios";
import Toast from "@/components/ToastPage.vue"; // Toast 컴포넌트의 경로에 맞게 수정
import { useToast } from "@/composables/toast.js";
import { useRouter } from "vue-router";
// import router from "@/router";

export default {
  components: {
    // TodoSimpleForm,
    TodoList,
    Toast,
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
    const router = useRouter();
    const error = ref("");
    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);
    const searchText = ref("");
    watch(currentPage, (currentPage, prev) => {
      console.log(currentPage, prev);
    });
    const numberOfPage = computed(() => {
      return Math.ceil(numberOfTodos.value / limit); // numberOfTodos(투두스의 갯수를 )limit(페이지에 몇개 보여줄지 )를 나눠서 페이지를 몇장까지 보여줘야할지 계산해야되고 반올림으로 받아야해서 math를 이용함
    });

    const { toastMessage, toastAlertType, showToast, triggerToast } = useToast();

    // watchEffect(() => {
    //   console.log(currentPage.value);
    //   console.log(numberOfTodos.value);
    // });

    watchEffect(() => {
      //   console.log(numberOfPage.value);/
    });

    //      const toastMessage = ref("");
    //   const toastAlertType = ref("");
    //   const showToast = ref(false);

    //   const timeout = ref(null);
    //   const triggerToast = (message, type = "success") => {
    //     showToast.value = true;
    //     toastMessage.value = message;
    //     toastAlertType.value = type;

    //     timeout.value = setTimeout(() => {
    //       toastMessage.value = "";
    //       toastAlertType.value = "";
    //       showToast.value = false;
    //     }, 3000);
    //   };
    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;
      try {
        const res = await axios.get(`http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`);
        //요청할때 페이지랑 _page=1 리밋(몇개씩 보여줄건지 )_limit=5 /한 페이지에 5장씩 보여줄거다
        numberOfTodos.value = res.headers["x-total-count"];
        // console.log(]);
        todos.value = res.data;
      } catch (err) {
        console.log(err);
        error.value = "Sometihing went wrong";
        triggerToast("Something went wrong", "danger");
      }
    };
    getTodos();
    const addTodo = async (todo) => {
      //데이터 베이스에 투두를 저장해주기
      error.value = "";
      try {
        await axios.post("http://localhost:3000/todos", {
          subject: todo.subject,
          completed: todo.completed,
        });
        getTodos(1);
        // todos.value.push(res.data);
      } catch (err) {
        error.value = "Sometihing went wrong";
        triggerToast("Something went wrong", "danger");
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

    const toggleTodo = async (index, checked) => {
      console.log(checked);
      error.value = "";
      const id = todos.value[index].id;
      try {
        await axios.patch("http://localhost:3000/todos/" + id, { completed: checked });
        //put은 데이터 전체를 통째로 변경해주는거 patch는 부분적으로 변경해주는 것 // 토글 체크 상태 데이터도 함께 보내기
        todos.value[index].completed = checked;
      } catch (err) {
        console.log(err);
        error.value = "Sometihing went wrong";
        triggerToast("Something went wrong", "danger");
      }
    };

    const deleteTodo = async (id) => {
      //   const id = todos.value[index].id;
      try {
        await axios.delete("http://localhost:3000/todos/" + id);
        // todos.value.splice(index, 1);
        // console.log("deleteTodo");
        error.value = "";
        getTodos(1);
      } catch (err) {
        console.log(err);
        error.value = "Sometihing went wrong";
        triggerToast("Something went wrong", "danger");
      }
    };
    const moveToCreatePage = () => {
      router.push({
        name: "TodoCreate",
      });
    };

    let timeOut = null;
    const searchTodo = () => {
      clearTimeout(timeOut);
      getTodos(1);
    };
    watch(searchText, () => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        getTodos(1);
      }, 1000);
    });

    // const filteredTodos = computed(() => {
    //   if (searchText.value) {
    //     return todos.value.filter((todo) => {
    //       return todo.subject.includes(searchText.value);
    //     });
    //   }
    //   return todos.value;
    // });
    return {
      todos,
      addTodo,
      //   toggle,
      //   onToggle,
      searchText,
      //   filteredTodos,
      error,
      numberOfPage,
      currentPage,
      searchTodo,

      //   res,
      //   todoStyle,
      deleteTodo,
      toggleTodo,
      getTodos,
      toastMessage,
      toastAlertType,
      showToast,
      moveToCreatePage,
      triggerToast,
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
.pagination {
  justify-content: center;
}
</style>
