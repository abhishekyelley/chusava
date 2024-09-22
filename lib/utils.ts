import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const usernameRegex = /^[a-zA-Z0-9_]*$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const nameRegex = /^[a-z ,.'-]+$/i;

export function getOrigin(value: string) {
  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return "";
  }
}