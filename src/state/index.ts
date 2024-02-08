import { atom } from "jotai";

export const authStateAtom = atom(false);

export const selectedImageAtom = atom<File | null>(null);
