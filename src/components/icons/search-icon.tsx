import type { SVGProps } from "react";

export default function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 12.8 12.8"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M10.4 11.2 7.975 8.775q-1.05.8-2.375.8-1.075 0-2-.525-.925-.55-1.45-1.475-.55-.925-.55-2t.55-2q.525-.925 1.45-1.45.925-.55 2-.55t2 .55q.925.525 1.475 1.45.525.925.525 2 0 1.35-.825 2.4L11.2 10.4zM5.575 8.4q1.175 0 2-.825.8-.825.8-1.975 0-1.175-.8-1.975-.825-.825-2-.825-1.15 0-1.975.825-.825.8-.825 1.975 0 1.15.825 1.975t1.975.825" />
    </svg>
  );
}
