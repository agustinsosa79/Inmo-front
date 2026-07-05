export const getThumbnailUrl = (url: string) => {
  return url.replace(
    "/upload/",
    "/upload/w_300,h_200,c_fill,q_auto,f_auto/"
  );
};