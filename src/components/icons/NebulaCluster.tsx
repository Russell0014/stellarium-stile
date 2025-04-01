import * as React from "react";
import type { SVGProps } from "react";
const SvgNebulaCluster = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={24}
    height={24}
    {...props}
  >
    <rect
      width={18}
      height={18}
      x={3}
      y={3}
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      rx={2}
      ry={2}
    />
    <circle
      id="nebula_cluster_svg__a"
      cx={12}
      cy={6.5}
      r={1}
      fill="#fff"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <use
      xlinkHref="#nebula_cluster_svg__a"
      id="nebula_cluster_svg__b"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#nebula_cluster_svg__b"
      id="nebula_cluster_svg__c"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#nebula_cluster_svg__c"
      id="nebula_cluster_svg__d"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#nebula_cluster_svg__d"
      id="nebula_cluster_svg__e"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#nebula_cluster_svg__e"
      id="nebula_cluster_svg__f"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#nebula_cluster_svg__f"
      id="nebula_cluster_svg__g"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#nebula_cluster_svg__g"
      width="100%"
      height="100%"
      transform="rotate(45 12 12)"
    />
  </svg>
);
export default SvgNebulaCluster;
