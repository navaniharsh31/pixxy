"use client";
import { HTMLInputTypeAttribute, useState } from "react";
import clsx from "clsx";

export interface InputProps {
  label?: string;
  errorText?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  helperText?: string;
  inputChildren?: React.ReactNode;
  inputRef?: React.RefObject<HTMLInputElement>;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const BaseInput = (props: InputProps) => {
  return (
    <div className={clsx("w-full flex flex-col gap-1", props.className)}>
      {props.label ? (
        <label className="text-sm font-medium text-gray-700">
          {props.label}
        </label>
      ) : null}
      <div
        className={clsx(
          "border border-gray-300 rounded-md px-3 py-2 w-full h-full flex gap-2 focus-within:border-orange-500 transition duration-300 ease-in-out"
        )}
      >
        <input
          id={props.id}
          name={props.name}
          value={props.value}
          disabled={props.disabled}
          type={props.type}
          className="w-full h-full border-none bg-transparent focus:outline-none"
          placeholder={props.placeholder}
          onChange={props.onChange}
          ref={props.inputRef}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          {...props.inputProps}
        />
        {props.inputChildren}
      </div>
      {props.helperText ? (
        <span className="text-sm text-gray-500">{props.helperText}</span>
      ) : null}
      {props.errorText ? (
        <span className="text-sm text-red-500">{props.errorText}</span>
      ) : null}
    </div>
  );
};

export default BaseInput;
