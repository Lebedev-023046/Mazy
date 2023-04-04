import Link from "next/link";
import React, { forwardRef } from "react";

interface IDropdownLinkProps {
  href: string;
  children: React.ReactNode;
  className: string;
}

const DropdownLink = forwardRef(
  // eslint-disable-next-line no-unused-vars
  ({ href, children, ...rest }: IDropdownLinkProps, ref) => {
    return (
      <Link href={href} {...rest}>
        <div>{children}</div>
      </Link>
    );
  }
);

DropdownLink.displayName = "DropdownLink";

export default DropdownLink;
