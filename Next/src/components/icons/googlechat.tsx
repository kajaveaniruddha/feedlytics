import * as React from "react";

// By: ph
// See: https://v0.app/icon/ph/chats-fill
// Example: <IconPhChatsFill width="24px" height="24px" style={{color: "#000000"}} />

export const IconPhChatsFill = ({
  height = "1em",
  fill = "currentColor",
  focusable = "false",
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    height={height}
    focusable={focusable}
    {...props}
  >
    <path
      fill={fill}
      d="M232 96a16 16 0 0 0-16-16h-32V48a16 16 0 0 0-16-16H40a16 16 0 0 0-16 16v128a8 8 0 0 0 13 6.22L72 154v30a16 16 0 0 0 16 16h93.59L219 230.22a8 8 0 0 0 5 1.78a8 8 0 0 0 8-8Zm-42.55 89.78a8 8 0 0 0-5-1.78H88v-32h80a16 16 0 0 0 16-16V96h32v111.25Z"
    />
  </svg>
);
