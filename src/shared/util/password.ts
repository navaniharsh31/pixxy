export const isPasswordValid = (password: string) => {
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isLengthValid = password.length >= 8;

  return {
    hasCapital,
    hasNumber,
    hasSpecialChar,
    isLengthValid,
  };
};
