import * as React from "react";

const NextImage = ({ src, alt = "", ...props }: any) => (
  // @ts-ignore
  <img src={typeof src === "string" ? src : ""} alt={alt} {...props} />
);

export default NextImage;
export const __esModule = true;
