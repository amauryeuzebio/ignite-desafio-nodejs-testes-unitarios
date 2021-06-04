import { CreateUserError } from "./CreateUserError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  it("Should be able to create a user", async () => {
    const userDTO = {
      name: "Amaury Euzebio",
      email: "amaury@teste.com.br",
      password: "123456",
    };
    const user = await createUserUseCase.execute(userDTO);

    expect(user).toHaveProperty("id");
  });

  it("Shouldn't be able to create a usar with the same email", async () => {
    expect(async () => {
      const userDTO = {
        name: "Amaury Euzebio",
        email: "amaury@teste.com.br",
        password: "123456",
      };
      await createUserUseCase.execute(userDTO);
      await createUserUseCase.execute(userDTO);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
