import React, { CSSProperties, ReactNode } from "react";
interface IProps {
  children: ReactNode;
  height?: number;
  weight?: number;
  color?: string;
  onClick?: () => void;
  className?: string;
  borderRadius?: string;
  minWidth?: number;
  isLoading?: boolean;
  style?: CSSProperties;
  cursor?: string;
  inLineColor?: boolean;
  maxWidth?: number;
}

const IconBg: React.FC<IProps> = ({
  children,
  height = 2.5,
  weight = 2.5,
  onClick,
  color = "secondary",
  className,
  borderRadius,
  minWidth,
  isLoading,
  style,
  cursor,
  inLineColor = false,
  maxWidth,
}) => {
  return (
    <div
      style={{
        ...style,
        width: `${weight}rem`,
        height: `${height}rem`,
        backgroundColor: inLineColor ? color : `var(--${color})`,
        borderRadius: borderRadius ?? "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: `${minWidth}rem`,
        maxWidth: `${maxWidth}rem`,
        pointerEvents: isLoading ? "none" : "auto",
        cursor: `${cursor}`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick && !isLoading) onClick();
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default IconBg;
