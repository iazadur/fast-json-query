import queryJSON from "../src/index";
import { Query } from "../src/types";

interface TestData {
  id: number;
  name: string;
  age: number;
  city: string;
  active: boolean;
  tags: string[];
}

const testData: TestData[] = [
  {
    id: 1,
    name: "Alice",
    age: 25,
    city: "New York",
    active: true,
    tags: ["dev", "js"],
  },
  {
    id: 2,
    name: "Bob",
    age: 30,
    city: "London",
    active: false,
    tags: ["dev", "python"],
  },
  {
    id: 3,
    name: "Charlie",
    age: 35,
    city: "New York",
    active: true,
    tags: ["dev", "java"],
  },
  {
    id: 4,
    name: "David",
    age: 28,
    city: "Paris",
    active: false,
    tags: ["design"],
  },
];

describe("queryJSON", () => {
  describe("Basic Operators", () => {
    test("simple equality query", () => {
      const result = queryJSON(testData, { city: "New York" });
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual([1, 3]);
    });

    test("greater than operator", () => {
      const result = queryJSON(testData, { age: { $gt: 30 } });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    test("less than operator", () => {
      const result = queryJSON(testData, { age: { $lt: 30 } });
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual([1, 4]);
    });

    test("in operator", () => {
      const result = queryJSON(testData, {
        city: { $in: ["New York", "Paris"] },
      });
      expect(result).toHaveLength(3);
      expect(result.map((item) => item.id)).toEqual([1, 3, 4]);
    });

    test("regex operator", () => {
      const result = queryJSON(testData, { name: { $regex: /^[AB]/ } });
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual([1, 2]);
    });
  });

  describe("Logical Operators", () => {
    test("$or operator", () => {
      const result = queryJSON(testData, {
        $or: [{ city: "Paris" }, { age: { $gt: 30 } }],
      });
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual([3, 4]);
    });

    test("$and operator", () => {
      const result = queryJSON(testData, {
        $and: [{ city: "New York" }, { active: true }],
      });
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual([1, 3]);
    });

    test("$not operator", () => {
      const result = queryJSON(testData, {
        city: { $not: { $in: ["New York", "London"] } },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(4);
    });
  });

  describe("Array Operators", () => {
    test("$size operator", () => {
      const result = queryJSON(testData, { tags: { $size: 2 } });
      expect(result).toHaveLength(3);
      expect(result.map((item) => item.id)).toEqual([1, 2, 3]);
    });

    test("$contains operator", () => {
      const result = queryJSON(testData, { tags: { $contains: "js" } });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe("Type Operators", () => {
    test("$exists operator", () => {
      const result = queryJSON(testData, { tags: { $exists: true } });
      expect(result).toHaveLength(4);
    });

    test("$type operator", () => {
      const result = queryJSON(testData, { age: { $type: "number" } });
      expect(result).toHaveLength(4);
    });
  });

  describe("Edge Cases", () => {
    test("empty result", () => {
      const result = queryJSON(testData, { city: "Tokyo" });
      expect(result).toHaveLength(0);
    });

    test("empty query", () => {
      const result = queryJSON(testData, {});
      expect(result).toEqual(testData);
    });

    test("invalid input data", () => {
      expect(() => queryJSON(null as any, {})).toThrow(
        "Input data must be an array"
      );
    });

    test("invalid query", () => {
      expect(() => queryJSON(testData, null as any)).toThrow(
        "Query must be an object"
      );
    });
  });
});
