import { Query, QueryOperators, QueryOptions } from "./types";

function getNestedValue(obj: any, path: string): any {
  return path
    .split(".")
    .reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

function evaluateCondition(
  value: any,
  condition: any,
  options: { caseSensitive?: boolean } = {}
): boolean {
  if (condition === null || condition === undefined) {
    return value === condition;
  }

  if (typeof condition === "object") {
    for (const [operator, operand] of Object.entries(condition)) {
      switch (operator as QueryOperators) {
        case "$eq":
          return value === operand;
        case "$ne":
          return value !== operand;
        case "$gt":
          return (
            typeof value === "number" &&
            typeof operand === "number" &&
            value > operand
          );
        case "$gte":
          return (
            typeof value === "number" &&
            typeof operand === "number" &&
            value >= operand
          );
        case "$lt":
          return (
            typeof value === "number" &&
            typeof operand === "number" &&
            value < operand
          );
        case "$lte":
          return (
            typeof value === "number" &&
            typeof operand === "number" &&
            value <= operand
          );
        case "$in":
          return Array.isArray(operand) && operand.includes(value);
        case "$nin":
          return Array.isArray(operand) && !operand.includes(value);
        case "$regex":
          if (!(operand instanceof RegExp)) return false;
          const stringValue = String(value);
          return options.caseSensitive === false
            ? operand.test(stringValue.toLowerCase())
            : operand.test(stringValue);
        case "$exists":
          return typeof operand === "boolean"
            ? operand === (value !== undefined)
            : false;
        case "$type":
          return typeof operand === "string" && typeof value === operand;
        case "$size":
          return (
            Array.isArray(value) &&
            typeof operand === "number" &&
            value.length === operand
          );
        case "$contains":
          return Array.isArray(value) && value.includes(operand);
        case "$not":
          return !evaluateCondition(value, operand, options);
        default:
          return false;
      }
    }
  }

  return value === condition;
}

function evaluateQuery<T>(
  item: T,
  query: Query,
  options: QueryOptions = {}
): boolean {
  if (!query || typeof query !== "object") {
    return true;
  }

  for (const [key, condition] of Object.entries(query)) {
    if (key === "$or" && Array.isArray(condition)) {
      return condition.some((subQuery) =>
        evaluateQuery(item, subQuery, options)
      );
    } else if (key === "$and" && Array.isArray(condition)) {
      return condition.every((subQuery) =>
        evaluateQuery(item, subQuery, options)
      );
    } else if (key === "$not") {
      return !evaluateQuery(item, condition as Query, options);
    } else {
      const value = getNestedValue(item, key);
      if (!evaluateCondition(value, condition, options)) {
        return false;
      }
    }
  }

  return true;
}

export function queryJSON<T>(
  data: T[],
  query: Query,
  options: QueryOptions = {}
): T[] {
  if (!Array.isArray(data)) {
    throw new Error("Input data must be an array");
  }

  if (!query || typeof query !== "object") {
    throw new Error("Query must be an object");
  }

  return data.filter((item) => evaluateQuery(item, query, options));
}

export default queryJSON;
