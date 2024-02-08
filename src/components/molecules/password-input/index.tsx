"use client";

import BaseInput from "@/components/atoms/input";
import { isPasswordValid } from "@/shared/util/password";
import { useMemo, useRef, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
  AiOutlineEye,
} from "react-icons/ai";
import { usePopper } from "react-popper";

interface PasswordInputProps {
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  passwordValidity: {
    hasCapital: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    isLengthValid: boolean;
  };
  isValid: boolean;
}

const PasswordInput = ({
  error,
  onChange: handleOnChange,
  value: password,
  passwordValidity,
  isValid,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(inputRef.current, popperElement, {
    placement: "auto",
    modifiers: [
      {
        name: "offset",

        options: {
          offset: [0, 20],
        },
      },
    ],
  });

  const handleInputFocus = () => {
    if (
      passwordValidity.isLengthValid &&
      passwordValidity.hasCapital &&
      passwordValidity.hasNumber &&
      passwordValidity.hasSpecialChar
    )
      return;
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setIsOpen(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOnChange(e);
    const passwordValidity = isPasswordValid(e.target.value);
    if (
      !passwordValidity.isLengthValid ||
      !passwordValidity.hasCapital ||
      !passwordValidity.hasNumber ||
      !passwordValidity.hasSpecialChar
    )
      setIsOpen(true);
  };

  return (
    <div className="w-full">
      <BaseInput
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        onChange={handlePasswordChange}
        name="password"
        value={password}
        errorText={error}
        inputRef={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        inputChildren={
          password ? (
            <button
              onMouseEnter={() => setShowPassword(true)}
              onMouseLeave={() => setShowPassword(false)}
              className="focus:outline-none"
              type="button"
            >
              <AiOutlineEye />
            </button>
          ) : null
        }
      />
      {isOpen ? (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="popper absolute bg-white border border-gray-300 rounded shadow-md p-2"
        >
          <div className="popper-inner">
            <p className="text-sm font-medium mb-1">Password must contain:</p>
            <ul className="flex gap-1 flex-col">
              <li className="text-sm flex items-center gap-1">
                {passwordValidity.isLengthValid ? (
                  <AiOutlineCheckCircle className="text-orange-500" size={16} />
                ) : (
                  <AiOutlineExclamationCircle size={16} />
                )}{" "}
                8 characters
              </li>
              <li className="text-sm flex items-center gap-1">
                {passwordValidity.hasCapital ? (
                  <AiOutlineCheckCircle className="text-orange-500" size={16} />
                ) : (
                  <AiOutlineExclamationCircle size={16} />
                )}{" "}
                One capital letter
              </li>
              <li className="text-sm flex items-center gap-1">
                {passwordValidity.hasNumber ? (
                  <AiOutlineCheckCircle className="text-orange-500" size={16} />
                ) : (
                  <AiOutlineExclamationCircle size={16} />
                )}{" "}
                One number
              </li>
              <li className="text-sm flex items-center gap-1">
                {passwordValidity.hasSpecialChar ? (
                  <AiOutlineCheckCircle className="text-orange-500" size={16} />
                ) : (
                  <AiOutlineExclamationCircle size={16} />
                )}{" "}
                One special character
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PasswordInput;
