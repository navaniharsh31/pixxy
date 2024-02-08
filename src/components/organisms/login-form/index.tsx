"use client";

import BaseButton from "@/components/atoms/button";
import BaseInput from "@/components/atoms/input";
import PasswordInput from "@/components/molecules/password-input";
import { validateEmail } from "@/shared/util/email";
import { isPasswordValid } from "@/shared/util/password";
import { authStateAtom } from "@/state";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();
  const setAuth = useSetAtom(authStateAtom);

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.name === "email") setEmail(e.target.value);
      else if (e.target.name === "password") {
        setPassword(e.target.value);
      }
    },
    []
  );

  const passwordValidity = useMemo(() => isPasswordValid(password), [password]);

  const passwordIsValid = useMemo(
    () =>
      passwordValidity.isLengthValid &&
      passwordValidity.hasCapital &&
      passwordValidity.hasNumber &&
      passwordValidity.hasSpecialChar,
    [passwordValidity]
  );

  useEffect(() => {
    if (passwordIsValid && errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  }, [passwordIsValid, errors.password]);

  const handleOnSubmit = useCallback(() => {
    const emailIsValid = validateEmail(email);
    if (!emailIsValid) {
      setErrors((prev) => ({ ...prev, email: "Invalid email" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
    if (!passwordIsValid) {
      setErrors((prev) => ({ ...prev, password: "Invalid password" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    if (emailIsValid && passwordIsValid) {
      setAuth(true);
      router.push("/editor");
    }
  }, [email, passwordIsValid, router, setAuth]);

  return (
    <div className="flex flex-col items-center justify-center w-96 h-96 gap-4">
      <h1 className="text-3xl font-semibold mb-4 text-gray-700">Login</h1>
      <BaseInput
        label="Email"
        type="email"
        placeholder="johndoe@email.com"
        value={email}
        onChange={handleOnChange}
        name="email"
        errorText={errors.email}
      />
      <PasswordInput
        value={password}
        error={errors.password}
        onChange={handleOnChange}
        isValid={passwordIsValid}
        passwordValidity={passwordValidity}
      />
      <BaseButton label="Login" onClick={handleOnSubmit} />
    </div>
  );
};

export default LoginForm;
