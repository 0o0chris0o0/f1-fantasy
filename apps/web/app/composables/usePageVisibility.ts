export const usePageVisibility = () => {
  const visible = ref(true);

  if (!import.meta.client) {
    return { visible };
  }

  const handleVisibilityChange = () => {
    visible.value = !document.hidden;
  };

  onMounted(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });

  return { visible };
};
