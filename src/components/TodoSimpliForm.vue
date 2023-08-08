<template>
  <form class="" @submit.prevent="onSubmit">
    <div class="d-flex">
      <div class="flex-grow-1 mr-2"><input type="text" v-model="todo" class="form-control" placeholder="Type-new to-do" /></div>
      <div><button type="submit" class="btn btn-primary">Add</button></div>
    </div>
    <div v-show="hasErorr" class="" style="color: red">입력창이 비어있습니다</div>
  </form>
</template>

<script>
import { ref } from "vue";
export default {
  emit: ["add-todo"],
  setup(props, { emit }) {
    const todo = ref("");
    const hasErorr = ref(false);
    const onSubmit = () => {
      if (todo.value === "") {
        hasErorr.value = true;
      } else {
        emit("add-todo", {
          id: Date.now(),
          subject: todo.value,
          completed: false,
        });

        hasErorr.value = false;
        todo.value = "";
      }
    };
    return {
      todo,
      hasErorr,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped></style>
