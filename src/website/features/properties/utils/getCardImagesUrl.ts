export const getCardImageUrl = (url: string) => {
  return url.replace(
    "/upload/",
    "/upload/w_1200,q_auto,f_auto/"
  );
};