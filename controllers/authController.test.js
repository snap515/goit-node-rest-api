const authController = require("./authController");
const login = authController.login;

const req = {
  body: {
    email: "email@mail.com",
    password: "123456",
  },
};

const res = {
  json: jest.fn(),
};

describe("test login function", () => {
  test("відповідь повина мати статус-код 200", () => {
    const result = login(req, res);
    expect(result.status).toBe(200);
  });
});
