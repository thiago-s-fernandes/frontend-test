import type { SVGProps } from "react";

export default function ChevronUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-testid="chevron-up-icon"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
