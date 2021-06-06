import { inject, injectable } from "tsyringe";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferStatementError } from "./TransferStatementError";
import { OperationType } from "../../entities/Statement";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";

interface IRequest {
  amount: number;
  description: string;
  sender_id: string;
  receiver_id: string;
  type: OperationType;
}

@injectable()
class TransferStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    description,
    type,
    receiver_id,
    sender_id,
  }: IRequest): Promise<void> {
    const user_sender = await this.usersRepository.findById(sender_id);
    const user_receiver = await this.usersRepository.findById(receiver_id);

    if (!user_sender) {
      throw new TransferStatementError.UserNotFound();
    }

    if (!user_receiver) {
      throw new TransferStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id as string,
    });

    if (amount > balance) {
      throw new TransferStatementError.InsufficientFunds();
    }

    // Envio
    await this.statementsRepository.create({
      user_id: sender_id,
      type,
      amount,
      description,
    });

    // Recebimento
    await this.statementsRepository.create({
      user_id: receiver_id,
      type,
      amount,
      description,
      sender_id,
    });
  }
}

export { TransferStatementUseCase };
