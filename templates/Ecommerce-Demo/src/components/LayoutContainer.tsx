import { ReactNode } from "react";

interface LayoutContainerProps {
  children: ReactNode;
  className?: string;
}

export default function LayoutContainer({ children, className = "" }: LayoutContainerProps) {
  return (
    <div className={`w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}
