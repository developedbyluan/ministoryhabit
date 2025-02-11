// export const addSentenceToLocalStorage = (sentence: string) => {
//   const arr = JSON.parse(localStorage.getItem("exposure_list") || "[]");
//   arr.push(sentence);
//   localStorage.setItem("exposure_list", JSON.stringify(arr));
// };

export const addSentenceToLocalStorage = (sentence: string) => {
  try {
    const storedList = localStorage.getItem("exposure_list");
    const arr: string[] = storedList ? JSON.parse(storedList) : [];

    if (!Array.isArray(arr)) throw new Error("Corrupted localStorage data");

    // Optional: Limit stored items to prevent excessive growth
    const MAX_ITEMS = 500;
    const updatedArr = [...arr, sentence].slice(-MAX_ITEMS);

    localStorage.setItem("exposure_list", JSON.stringify(updatedArr));
  } catch (error) {
    console.error("Error handling localStorage:", error);
  }
};