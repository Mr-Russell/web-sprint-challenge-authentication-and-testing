
it("should run tests using it()", function () {
  expect(true).toBe(true);
  expect(true).not.toBe(false)
  expect(true).toBeTruthy();
  expect(true).not.toBeUndefined();
});


it("checks references", function () {
  expect({ name: 'Brian' }).toEqual({ name: 'Brian' });
  expect(["a", "b"]).toEqual(["a", "b"]);
  expect([1, 2, 3]).toHaveLength(3);
  expect(NaN).toBeNaN();
});