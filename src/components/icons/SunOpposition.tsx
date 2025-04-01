import * as React from "react";
import type { SVGProps } from "react";
const SvgSunOpposition = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path
      fill="#fff"
      d="M22.443 6 21.17 7.273 21.2 9h-1.8l-1.2 1.243-1.272-1.273L15.2 9V7.2L13.958 6l1.273-1.273L15.2 3H17l1.2-1.243 1.272 1.273L21.2 3v1.8z"
    />
    <circle cx={11} cy={13} r={2} fill="#fff" />
    <circle cx={3} cy={21} r={1} fill="#fff" />
    <path fill="none" stroke="#fff" strokeDasharray="1, 1" d="M4 20 15 9" />
  </svg>
);
export default SvgSunOpposition;
