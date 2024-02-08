"use client";
import { MouseEventHandler, ReactNode, useState } from "react";
import { usePopper } from "react-popper";
import { IconType } from "react-icons";
import { PiTextTBold } from "react-icons/pi";
import { Placement } from "@popperjs/core";
import { useAtomValue } from "jotai";
import { selectedImageAtom } from "@/state";
import clsx from "clsx";

interface ToolButtonProps {
  Icon: IconType;
  onClick: MouseEventHandler<HTMLButtonElement>;
  tooltipLabel: ReactNode;
  placement?: Placement;
  classNames?: string;
}

const ToolButton = ({
  Icon,
  onClick,
  tooltipLabel,
  classNames,
  placement = "right",
}: ToolButtonProps) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const selectedImage = useAtomValue(selectedImageAtom);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  return (
    <>
      <button
        disabled={!selectedImage}
        ref={setReferenceElement}
        onClick={onClick}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        className={clsx(
          "relative bg-orange-200 group flex items-center justify-center w-full rounded-md h-12 hover:bg-orange-500 disabled:bg-gray-200 ",
          classNames
        )}
      >
        <Icon size={24} className="group-hover:text-white" />
        {tooltipVisible && (
          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className="tooltip z-10 bg-gray-800 text-white py-2 px-4 rounded-md"
          >
            {tooltipLabel}
          </div>
        )}
      </button>
    </>
  );
};

export default ToolButton;
