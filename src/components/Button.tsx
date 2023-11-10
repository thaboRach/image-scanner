import React from "react";

type ButtonProps = {
  children: string;
  onClick: () => void;
} & React.ComponentPropsWithoutRef<"button">;

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="bg-blue-600 p-2 rounded border-[1px] border-solid border-black"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
