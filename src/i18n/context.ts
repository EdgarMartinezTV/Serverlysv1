"use client";
import { createContext } from "react";
/** Spanish strings for browser components; null (no provider) = English. */
export const DictContext = createContext<Readonly<Record<string, string>> | null>(null);
