// Temporary — real auth এর আগে পর্যন্ত
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};