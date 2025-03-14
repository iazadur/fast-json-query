export type ComparisonOperator = {
  $eq?: any;
  $gt?: number;
  $gte?: number;
  $lt?: number;
  $lte?: number;
  $ne?: any;
  $in?: any[];
  $nin?: any[];
  $regex?: RegExp;
  $exists?: boolean;
  $type?: string;
  $size?: number;
  $contains?: any;
};

export type LogicalOperator = {
  $and?: Query[];
  $or?: Query[];
  $not?: Query;
};

export type QueryValue = any | ComparisonOperator;

export type Query = {
  [key: string]: QueryValue | LogicalOperator[keyof LogicalOperator];
};

export type QueryResult<T> = T[];

export interface UseJsonQueryResult<T> {
  results: T[];
  isDebouncing: boolean;
}

export type QueryOperators = keyof ComparisonOperator | keyof LogicalOperator;

export type QueryType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "null"
  | "undefined";

export interface QueryOptions {
  caseSensitive?: boolean;
}
