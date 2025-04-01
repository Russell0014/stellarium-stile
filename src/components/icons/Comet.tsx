import * as React from "react";
import type { SVGProps } from "react";
const SvgComet = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path
      fill="#fff"
      d="m11 18-1 1.25-.172 1.578-1.59.177L7 22l-1.25-1-1.578-.172-.177-1.591L3 18l1-1.25.172-1.578 1.59-.177L7 14l1.25 1 1.578.172.177 1.59z"
    />
    <path
      fill="none"
      stroke="#fff"
      strokeWidth={2.125}
      d="M8 15c3.843-8.022 6.674-10.3 10-13"
    />
    <path
      fill="none"
      stroke="#fff"
      strokeWidth={2.213}
      d="M8.25 15C10.137 8.473 18.765 5.068 22 4.5"
    />
    <path
      fill="none"
      stroke="#fff"
      strokeWidth={2.199}
      d="M8.25 15c4.231-4.571 9.519-6.857 13.75-8"
    />
  </svg>
);
export default SvgComet;
