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
  const previousIndex = JSON.parse(
    localStorage.getItem(`lesson-${lessonSlug}--index`) || "0"
  );
  return previousIndex;
};

const today = new Date();

// Get year, month, and day
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
const day = String(today.getDate()).padStart(2, "0");

const formattedDate = `${year}-${month}-${day}`;

const storeTotalPlayTimeToLocalStorage = (
  lessonSlug: string,
  totalPlayTime: number
) => {
  // console.log(formattedDate); // e.g., "2023-10-05"

  const stats = {
    lesson_slug: lessonSlug,
    date: formattedDate,
    time: Date.now(),
    playing_time: totalPlayTime,
  };

  const previousStats = localStorage.getItem("stats");

  if (previousStats) {
    const array = JSON.parse(previousStats);
    array.push(stats);

    localStorage.setItem("stats", JSON.stringify(array));
  } else {
    const newArr = [];
    newArr.push(stats);
    localStorage.setItem("stats", JSON.stringify(newArr));
  }
};

export {
  storeIndexToLocalStorage,
  getIndexFromLocalStorage,
  storeTotalPlayTimeToLocalStorage,
};
