import type { SVGProps } from "react";

export function FridgeGenieLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19.8 11.4c.4-.2.8-.5 1-1a2.3 2.3 0 0 0-2-4.2c-.3 0-.6.1-.9.2" />
      <path d="M19.8 11.4A8.4 8.4 0 0 1 22 18c0 2.2-1.8 4-4 4h-1" />
      <path d="M4 18c-1.2 0-2.2-.7-2.6-1.7-.3-1.2.3-2.4 1.3-3 .6-.3 1.2-.3 1.8-.2" />
      <path d="M4 18a8.4 8.4 0 0 0 2.2-6.6c0-4.1 2.8-7.7 6.6-8.3" />
      <path d="M12.3 6.9c.4-.2.8-.3 1.2-.3a2.3 2.3 0 0 1 2.2 2.9c0 .4-.1.7-.2 1" />
      <path d="M8 22a4 4 0 0 0 4-4h-1" />
      <path d="m14 6-2-4" />
    </svg>
  );
}
