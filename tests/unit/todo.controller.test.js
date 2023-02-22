const TodoController = require("./../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json")
const allTodos = require("../mock-data/all-todos.json")
const todoById = require("../mock-data/get-todo-by-id.json")
const deletedTodo = require("../mock-data/deleted-todo.json")

jest.mock("../../model/todo.model");

let req, res, next;

const todoId = "63f3eea1366def11a4790749";

beforeEach(() => {

    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

})

describe('TodoController.updateTodo', () => { 
    it("should have a updateTodo function", () => {
        expect(typeof TodoController.updateTodo).toBe("function")
    })

    it("should update with TodoModel.findByIdAndUpdate", async () => {
        
        req.params.todoId = todoId;

        req.body = newTodo;
        
        await TodoController.updateTodo(req, res, next)
  
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, { new:true, useFindAndModify: false })
    })

    it("should return response with json data and http code 200", async () => {
        req.params.todoId = todoId;

        req.body = newTodo;

        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);

        await TodoController.updateTodo(req, res, next);

        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })

    it("should handle errors", async () => {
        const errorMessage = { message: "error in updateTodo" };
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);

        await TodoController.updateTodo(req, res, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    })


    it("should return 404 when item doesnt exist", async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);

        await TodoController.updateTodo(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

})

describe('TodoController.getTodoById', () => { 
    it("should have a getTodoById", () => {
        expect(typeof TodoController.getTodoById).toBe("function")
    })

    it("should call TodoModel.findById with route parameters", async () => {

        req.params.todoId = todoId

        await TodoController.getTodoById(req, res, next);
        
        expect(TodoModel.findById).toBeCalledWith("63f3eea1366def11a4790749");
    
    })

    it("should return json body and response code 200", async () => {
        TodoModel.findById.mockReturnValue(todoById);

        await TodoController.getTodoById(req, res, next)

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(todoById);
        expect(res._isEndCalled()).toBeTruthy();

    })

    it("should handle errors", async () => {
        const errorMessage = { message: "error in getTodoById" };
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.findById.mockReturnValue(rejectedPromise);

        await TodoController.getTodoById(req, res, next);

        expect(next).toBeCalledWith(errorMessage);
    })

    it("should return 404 when item doesnt exist", async () => {
        TodoModel.findById.mockReturnValue(null);

        await TodoController.getTodoById(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
})

describe('TodoController.getTodos', () => {
    it("should have a getTodos function", () => {
    
        expect(typeof TodoController.getTodos).toBe("function");
    
    })

    it("should call TodoModel.find({})", async () => {

        
        await TodoController.getTodos(req, res, next);
        
        expect(TodoModel.find).toHaveBeenCalledWith({});
    
    })

    it("should return 200 response code and all todos", async() => {
        
        TodoModel.find.mockReturnValue(allTodos);

        await TodoController.getTodos(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos)
    }) 

    it("should handle errors", async () => {
        const errorMessage = { message: "error finding" };
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.find.mockReturnValue(rejectedPromise);

        await TodoController.getTodos(req, res, next);

        expect(next).toBeCalledWith(errorMessage);
    })
})

describe('TodoController.createTodo', () => { 

    beforeEach(() => {
        req.body = newTodo;
    })
    
    it("should have a createTodo function", () => {
    
        expect(typeof TodoController.createTodo).toBe("function");
    
    })

    it("should call TodoModel.create", () => {

        
        TodoController.createTodo(req, res, next);
        
        expect(TodoModel.create).toBeCalledWith(newTodo);
    
    })

    it("should return 201 response code", async() => {
        
        await TodoController.createTodo(req, res, next);

        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should return json body in response", async () => {
        TodoModel.create.mockReturnValue(newTodo);

        await TodoController.createTodo(req, res, next);

        expect(res._getJSONData()).toStrictEqual(newTodo)
    })

    it("should handle errors", async () => {
        const errorMessage = { message: "done property missing" };
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.create.mockReturnValue(rejectedPromise);

        await TodoController.createTodo(req, res, next);

        expect(next).toBeCalledWith(errorMessage);
    })
})

describe("TodoController.deleteTodo", () => {
    it("should have a deleteTodo function", () => {
        expect(typeof TodoController.deleteTodo).toBe("function");
    })

    it("should delete with TodoModel.findByIdAndDelete", async () => {
        req.params.todoId = todoId;

        await TodoController.deleteTodo(req, res, next);

        expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId)
        
    })

    it("should return response with json data and http code 200", async () => {
    
        TodoModel.findByIdAndDelete.mockReturnValue(deletedTodo);

        await TodoController.deleteTodo(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(deletedTodo);
    
    })

    it("should handle errors", async () => { 

        const errorMessage = { message: "error finding" };
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);

        await TodoController.deleteTodo(req, res, next);

        expect(next).toBeCalledWith(errorMessage);
    })

    it("should return 404 when item doesnt exist", async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(null);

        await TodoController.deleteTodo(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
})