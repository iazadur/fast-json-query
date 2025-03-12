import type { QueryOperators, QueryCondition } from './types';

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function evaluateCondition(value: any, condition: QueryOperators | any): boolean {
  if (condition === null) {
    return value === null;
  }

  if (typeof condition !== 'object' || condition instanceof RegExp) {
    return value === condition;
  }

  // Handle comparison operators
  if (condition.$eq !== undefined) return value === condition.$eq;
  if (condition.$ne !== undefined) return value !== condition.$ne;
  if (condition.$gt !== undefined) return value > condition.$gt;
  if (condition.$gte !== undefined) return value >= condition.$gte;
  if (condition.$lt !== undefined) return value < condition.$lt;
  if (condition.$lte !== undefined) return value <= condition.$lte;
  if (condition.$in !== undefined) return condition.$in.includes(value);
  if (condition.$nin !== undefined) return !condition.$nin.includes(value);
  if (condition.$regex !== undefined) return condition.$regex.test(value);
  
  // Handle type operators
  if (condition.$exists !== undefined) {
    return condition.$exists ? value !== undefined : value === undefined;
  }
  if (condition.$type !== undefined) {
    return typeof value === condition.$type;
  }
  if (condition.$size !== undefined) {
    return Array.isArray(value) && value.length === condition.$size;
  }
  if (condition.$contains !== undefined) {
    return Array.isArray(value) && value.includes(condition.$contains);
  }
  if (condition.$not !== undefined) {
    return !evaluateCondition(value, condition.$not);
  }

  return false;
}

function evaluateQuery(item: any, query: QueryCondition): boolean {
  // Handle logical operators first
  if (query.$or) {
    return query.$or.some(subQuery => evaluateQuery(item, subQuery));
  }

  if (query.$and) {
    return query.$and.every(subQuery => evaluateQuery(item, subQuery));
  }

  // Handle regular field conditions
  return Object.entries(query).every(([key, condition]) => {
    if (key.startsWith('$')) return true; // Skip logical operators
    const value = getNestedValue(item, key);
    return evaluateCondition(value, condition);
  });
}

function queryJSON<T>(data: T[], query: QueryCondition): T[] {
  if (!Array.isArray(data)) {
    throw new Error('Input data must be an array');
  }

  if (typeof query !== 'object' || query === null) {
    throw new Error('Query must be an object');
  }

  return data.filter(item => evaluateQuery(item, query));
}

export { queryJSON as default, type QueryOperators, type QueryCondition }; 