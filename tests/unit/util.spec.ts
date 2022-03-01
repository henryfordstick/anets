import "@testing-library/jest-dom/extend-expect";
import * as util from "../../src/util";

describe("validate:", () => {
  describe("util.getType", () => {
    test("test array", () => {
      const result: string = util.getType([{ q: 1 }]);
      expect(result).toBe("array");
    });

    test("test object", () => {
      const result: string = util.getType({ a: 1, b: 2 });
      expect(result).toBe("object");
    });

    test("test number", () => {
      const result: string = util.getType(123);
      expect(result).toBe("number");
    });

    test("test boolean", () => {
      const result: string = util.getType(true);
      expect(result).toBe("boolean");
    });

    test("test function", () => {
      const result: string = util.getType(() => {});
      expect(result).toBe("function");
    });

    test("test string", () => {
      const result: string = util.getType("name");
      expect(result).toBe("string");
    });
  });

  describe("util.add", () => {
    test("add", () => {
      const result: number = util.add(0.1, 0.2);
      expect(result).toBe(0.3);
    });
  });

  describe("util.subtract", () => {
    test("subtract", () => {
      const result: number = util.subtract(3.666, 0.2);
      expect(result).toBe(3.466);
    });
  });

  describe("util.divide", () => {
    test("divide", () => {
      const result: number = util.divide(3.666, 2);
      expect(result).toBe(1.833);
    });
  });

  describe("util.multiply", () => {
    test("multiply", () => {
      const result: number = util.multiply(0.3, 0.2);
      expect(result).toBe(0.06);
    });
  });

  describe("util.getRandomArrayList", () => {
    test("0", () => {
      const result: number[] = util.getRandomArrayList(256);
      expect(result).toHaveLength(256);
    });
  });

  describe("removeElement", () => {
    test("0", () => {
      const dom: HTMLElement = document.createElement("div");
      dom.innerHTML = `<div data-testid="parent"><span data-testid="child"></span></div>`;
      const child = dom.querySelector("span[data-testid=child]");

      util.removeElement(<Element>child);
      expect(dom.querySelector("div[data-testid=parent]")?.innerHTML).toBe("");
    });
  });
});
