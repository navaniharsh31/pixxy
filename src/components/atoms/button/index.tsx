import clsx from "clsx";

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const BaseButton = (props: ButtonProps) => {
  return (
    <button
      className={clsx(
        "w-full  border-input border-gray-300 rounded-md px-3 py-2 focus:outline-none transition duration-300 ease-in-out bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
        props.className
      )}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
    >
      {props.label}
    </button>
  );
};

export default BaseButton;
