// const storeIndexToLocalStorage = (lessonSlug: string, currentTime: number) => {
//   localStorage.setItem(`lesson-${lessonSlug}--progress`, JSON.stringify(currentTime));
// };

// const getIndexFromLocalStorage = (lessonSlug: string): number => {
//   if (!lessonSlug) return 0;
//   const currentTime = JSON.parse(localStorage.getItem(lessonSlug) || "0");
//   return currentTime;
// };

const storeIndexToLocalStorage = (lessonSlug: string, currentIndex: number) => {
  localStorage.setItem(
    `lesson-${lessonSlug}--index`,
    JSON.stringify(currentIndex)
  );
};

const getIndexFromLocalStorage = (lessonSlug: string): number => {
  if (!lessonSlug) return 0;
  const previousIndex = JSON.parse(localStorage.getItem(`lesson-${lessonSlug}--index`) || "0");
  return previousIndex;
};

export { storeIndexToLocalStorage, getIndexFromLocalStorage };
