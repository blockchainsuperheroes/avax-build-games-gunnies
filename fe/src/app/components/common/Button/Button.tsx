import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from "react";
import "./style.css";
import clsx from "clsx";
import Link from "next/link";

export enum ButtonType {
  normal = "btn-normal",
  outLine = 'btn-outline',
  primary = "btn-primary",
  secondary = "btn-secondary",
  metamask = "btn-metamask",
  ghost = "btn-ghost",
  metamaskGhost = "btn-metamask-ghost",
  pera = 'btn-pera',
  view = '',
  viewActive = 'btn-view-active',
  loading = 'btn-loading',
  magic = 'btn-outline hover:btn-magic !font-chakra-petch !font-medium !text-[20px] !leading-[58px]',
}

const sizeMap: Record<string, string> = {
  larger: "!px-6 !py-3",
  large: "!px-8 !py-2",
  normal: "",
  small: "!px-4 !py-1.5",
  smaller: "!px-[10px] !py-1.5 !text-[12px]",
};

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string;
  children?: ReactNode;
  className?: string;
  btnType?: ButtonType;
  size?: string;
  href?: string;
  target?: string;
  linkClassName?: string;
};

export const Button = ({
  label,
  children,
  className,
  btnType = ButtonType.normal,
  size = "normal",
  href,
  target,
  linkClassName,
  ...props
}: ButtonProps) => {
  const defaultClassName = "cursor-pointer";
  const ButtonItem = (
    <button
      {...props}
      type="button"
      className={clsx(defaultClassName, sizeMap[size], btnType, className)}
      {...props}
    >
      {label}
      {children}
    </button>
  );
  return !href ? (
    ButtonItem
  ) : (
    <Link
      target={target}
      rel={target === "_blank" ? "noreferrer" : ""}
      href={href}
      className={clsx(defaultClassName, linkClassName)}
    >
      {ButtonItem}
    </Link>
  );
};
