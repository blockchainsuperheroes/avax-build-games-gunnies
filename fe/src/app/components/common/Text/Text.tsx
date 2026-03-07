import clsx from "clsx";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from "react";
import "./style.css";

export enum TextType {
  DisplayLarge = "text-[55px] md:text-[8rem] leading-[45px] md:leading-[6.25rem] tracking-[-0.03em] font-sora",
  DisplayMedium = "text-[48px] md:text-[6rem] leading-[45px] md:leading-[5rem] tracking-[-0.03em] font-sora",
  DisplaySmall = "text-[36px] md:text-[2.5rem] leading-[45px] md:leading-[3rem] tracking-[-0.03em] font-sora",
  HeadingMedium = "text-[15px] leading-4 font-odibee-sans",
  HeadingSmall = "text-base md:text-2xl tracking-[-0.1em] leading-[20px] md:leading-[30px] font-lexend-giga",
  HeadingToolTip = "text-[20px] leading-[28px] tracking-[-0.03em] font-sora",
  BodyLarge = "text-[2.5rem] tracking-[-0.1em] leading-[3.125rem] font-lexend-giga",
  BodyMedium = "text-[0.875rem] md:text=[1.25rem] tracking-[-0.1em] leading-[1.5rem] font-lexend-giga",
  BodyNormal = "text-base leading-8 font-lexend-giga",
  BodySmall = "text-[0.75rem] leading-4 font-lexend-giga",
  h1 = "text-[3.25rem] leading-[3.25rem] md:text-[4rem] md:leading-[4rem] font-sora",
  h2 = "text-[2.25rem] leading-[3.25rem] md:text-[3rem] md:leading-[3rem]",
  h3 = "",
  // h4 = "",
  // h5 = "",
  // h6 = "",
  // p = "",
  // span = "",
  HeadingH1 = "font-chakra font-bold text-[60px] leading-[72px] text-gunnies-dark-1",
  HeadingH2 = "font-chakra font-bold text-[48px] leading-[58px] text-gunnies-dark-1",
  HeadingH3 = "font-chakra font-bold text-[40px] leading-[48px] text-gunnies-dark-1",
  HeadingH4 = "font-chakra font-bold text-[30px] leading-[38px] text-gunnies-dark-1",
  HeadingH5 = "font-chakra font-semibold text-[24px] leading-[32px] text-gunnies-dark-1",
  HeadingH6 = "font-chakra font-semibold text-[20px] leading-[28px] text-gunnies-dark-1",
  HeadingMediumH1 = "font-chakra font-medium text-[60px] leading-[72px] text-gunnies-dark-1",
  HeadingMediumH2 = "font-chakra font-medium text-[48px] leading-[58px] text-gunnies-dark-1",
  HeadingMediumH3 = "font-chakra font-medium text-[40px] leading-[48px] text-gunnies-dark-1",
  HeadingMediumH4 = "font-chakra font-medium text-[30px] leading-[38px] text-gunnies-dark-1",
  HeadingMediumH5 = "font-chakra font-medium text-[24px] leading-[32px] text-gunnies-dark-1",
  HeadingMediumH6 = "font-chakra font-medium text-[20px] leading-[28px] text-gunnies-dark-1",
  BodyLargeExtraLight = "font-sora font-extralight text-[18px] leading-[26px] text-gunnies-dark-2",
  BodyLargeRegular = "font-sora text-[18px] leading-[26px] text-gunnies-dark-2",
  BodyLargeSemiBold = "font-sora font-semibold text-[18px] leading-[26px] text-gunnies-dark-2",
  BodyLargeBold = "font-sora font-bold text-[18px] leading-[26px] text-gunnies-dark-2",
  BodyMediumExtraLight = "font-sora font-extralight text-[16px] leading-[24px] text-gunnies-dark-2",
  BodyMediumRegular = "font-sora text-[16px] leading-[24px] text-gunnies-dark-2",
  BodyMediumSemiBold = "font-sora font-semibold text-[16px] leading-[24px] text-gunnies-dark-2",
  BodyMediumBold = "font-sora font-bold text-[16px] leading-[24px] text-gunnies-dark-2",
  BodySmallExtraLight = "font-sora font-extralight text-[14px] leading-[22px] text-gunnies-dark-2",
  BodySmallRegular = "font-sora text-[14px] leading-[22px] text-gunnies-dark-2",
  BodyExtraSmallExtraLight = "font-sora font-extralight text-[12px] leading-[20px] text-gunnies-dark-2",
  BodyExtraSmallRegular = "font-sora text-[12px] leading-[20px] text-gunnies-dark-2",
}

type TextProps = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLElement>,
  HTMLLabelElement
> &
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLHeadingElement> & {
    label?: string;
    children?: ReactNode;
    type?: TextType;
    className?: string;
  };

export const Text = ({
  label,
  children,
  type,
  className,
  ...props
}: TextProps) => {
  const defaultClassName = "text-white";
  switch (type) {
    case TextType.h1:
    case TextType.HeadingH1:
    case TextType.HeadingMediumH1:
      return (
        <h1 {...props} className={clsx(defaultClassName, type, className)}>
          {children}
          {label}
        </h1>
      );
    case TextType.h2:
    case TextType.HeadingH2:
    case TextType.HeadingMediumH2:
      return (
        <h2 {...props} className={clsx(defaultClassName, type, className)}>
          {children}
          {label}
        </h2>
      );
    case TextType.h3:
    case TextType.HeadingH3:
    case TextType.HeadingMediumH3:
      return (
        <h3 {...props} className={clsx(defaultClassName, type, className)}>
          {children}
          {label}
        </h3>
      );
    // case TextType.h4:
    case TextType.HeadingH4:
    case TextType.HeadingMediumH4:
      return (
        <h4 {...props} className={clsx(defaultClassName, type, className)}>
          {children}
          {label}
        </h4>
      );
    // case TextType.h5:
    case TextType.HeadingH5:
    case TextType.HeadingMediumH5:
      return (
        <h5 {...props} className={clsx(defaultClassName, type, className)}>
          {children}
          {label}
        </h5>
      );
    // case TextType.h6:
    case TextType.HeadingH6:
    case TextType.HeadingMediumH6:
      return (
        <h6 {...props} className={clsx(defaultClassName, type, className)}>
          {children}
          {label}
        </h6>
      );
    // case TextType.p:
    //   return (
    //     <p {...props} className={clsx(defaultClassName, type, className)}>
    //       {children}
    //       {label}
    //     </p>
    //   );
    // case TextType.span:
    //   return (
    //     <span {...props} className={clsx(defaultClassName, type, className)}>
    //       {children}
    //       {label}
    //     </span>
    //   );

    default:
      return (
        <label {...props} className={clsx(defaultClassName, type, className)}>
          {children}
          {label}
        </label>
      );
  }
};
