import { Multiply } from "./multiply";


test('properly multiplies two numbers', () => {
    const multiply = new Multiply();

    const res = multiply.multiply(22, 1)
    expect(res).toBe(22)
})