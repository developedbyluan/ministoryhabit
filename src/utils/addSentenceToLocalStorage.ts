export const addSentenceToLocalStorage = (sentence: string) => {
  const arr = JSON.parse(localStorage.getItem("exposure_list") || "[]");
  arr.push(sentence);
  localStorage.setItem("exposure_list", JSON.stringify(arr));
};
