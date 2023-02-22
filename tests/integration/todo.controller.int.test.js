const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos";

let firstTodo, newTodoId;

describe(`Integration tests`, () => {
  it(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();

    firstTodo = response.body[0];
  });

  it(`GET todo by Id ${endpointUrl} :todoId`, async () => {
    const response = await request(app).get(`${endpointUrl}/${firstTodo._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });
  it(`GET todo by Id doesnt exist ${endpointUrl} :todoId`, async () => {
    const response = await request(app).get(
      `${endpointUrl}/63f3eea1366def11a4712349`
    );

    expect(response.statusCode).toBe(404);
  });

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);

    newTodoId = response.body._id;
  });

  it(`should return error 500 on malformed data with POST ${endpointUrl} `, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ title: "Missin done property" });

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Todo validation failed: done: Path `done` is required.",
    });
  });

  it(`PUT ${endpointUrl}`, async () => {
    const testData = { title: "Make integration test for put", done: true}
    const res = await request(app).put(endpointUrl + "/" + newTodoId).send(testData)

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title)
    expect(res.body.done).toBe(testData.done)
  })
});
