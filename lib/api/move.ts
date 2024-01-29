import { throwExpression } from "../shared/utils";

export const EXAMPLE_MOVE_PACKAGE_ID = process.env.NEXT_PUBLIC_EXAMPLE_MOVE_PACKAGE_ID??
  throwExpression(new Error("EXAMPLE_MOVE_PACKAGE_ID not configured"));

export const MYPOST_MOVE_PACKAGE_ID = process.env.NEXT_PUBLIC_MYPOST_MOVE_PACKAGE_ID??
  throwExpression(new Error("MYPOST_MOVE_PACKAGE_ID not configured"));

export const GLOBAL_OBJECT_ID = process.env.NEXT_PUBLIC_GLOBAL_OBJECT_ID??
  throwExpression(new Error("GLOBAL_OBJECT_ID not configured"));

export const API_HOST = process.env.NEXT_PUBLIC_HOST??
  throwExpression(new Error("HOST not configured"));