import { ref, onUnmounted } from "vue";
export const useToast = () => {
  const toastMessage = ref("");
  const toastAlertType = ref("");
  const showToast = ref(false);

  const timeout = ref(null);
  const triggerToast = (message, type = "success") => {
    showToast.value = true;
    toastMessage.value = message;
    toastAlertType.value = type;

    timeout.value = setTimeout(() => {
      toastMessage.value = "";
      toastAlertType.value = "";
      showToast.value = false;
    }, 3000);
  };
  onUnmounted(() => {
    // console.log("언마운티드");
    clearTimeout(timeout.value);
  });
  return {
    toastMessage,
    toastAlertType,
    showToast,
    timeout,
    triggerToast,
  };
};
