import * as React from "react";
import type { SVGProps } from "react";
const SvgShootingStar = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path
      fill="#fff"
      d="m10 18-1 1.25-.172 1.578-1.59.177L6 22l-1.25-1-1.578-.172-.177-1.591L2 18l1-1.25.172-1.578 1.59-.177L6 14l1.25 1 1.578.172.177 1.59z"
    />
    <path
      fill="none"
      stroke="#fff"
      strokeWidth={2}
      d="M8 13.515C11.843 6.41 14.674 4.392 18 2"
    />
    <path
      fill="none"
      stroke="#fff"
      strokeWidth={2}
      d="M9.25 13.75C11 8 19 5 22 4.5"
    />
    <path fill="none" stroke="#fff" strokeWidth={2} d="M9 14c4-4 9-6 13-7" />
  </svg>
);
export default SvgShootingStar;
