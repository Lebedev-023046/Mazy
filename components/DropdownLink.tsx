import Link from "next/link";
import React from "react";

interface IDropdownLinkProps {
  href: string;
  children: React.ReactNode;
  className: string;
}

export default function DropdownLink({
  href,
  children,
  ...rest
}: IDropdownLinkProps) {
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
