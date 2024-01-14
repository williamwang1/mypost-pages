import { throwExpression } from "../shared/utils";

export const EXAMPLE_MOVE_PACKAGE_ID =
  process.env.EXAMPLE_MOVE_PACKAGE_ID ??
  throwExpression(new Error("EXAMPLE_MOVE_PACKAGE_ID not configured"));

export const MYPOST_MOVE_PACKAGE_ID = 
  process.env.MYPOST_MOVE_PACKAGE_ID ??
  throwExpression(new Error("MYPOST_MOVE_PACKAGE_ID not configured"));