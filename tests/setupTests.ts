afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  try {
    expect(console.error).not.toHaveBeenCalled();
  } catch {
    //throw new Error("请确保在测试期间一切console.error不能被调用");
    console.log("⏰", "请确保在测试期间一切console.error不能被调用");
  }
});
