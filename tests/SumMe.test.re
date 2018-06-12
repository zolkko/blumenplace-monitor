open Jest;

describe("SumMe", () => {
    open Expect;
    open SumMe;

    test("testing how summing 2 and 2 works", () => {
        expect(sumMe(2, 2)) |> toBe(4)
    });
});
