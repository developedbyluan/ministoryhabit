const storeIndexToLocalStorage = (lessonSlug: string, currentTime: number) => {
  localStorage.setItem(`lesson-${lessonSlug}--progress`, JSON.stringify(currentTime));
};

const getIndexFromLocalStorage = (lessonSlug: string): number => {
  if (!lessonSlug) return 0;
  const currentTime = JSON.parse(localStorage.getItem(lessonSlug) || "0");
  return currentTime;
};

export { storeIndexToLocalStorage, getIndexFromLocalStorage };
