import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { User, Gender, UserRole } from "./users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // 유저 정보 저장
  async saveUser(
    email: string,
    password: string,
    name: string,
    phone: string,
    gender: Gender,
    birthday: string
  ): Promise<User> {
    const user = this.userRepository.create({
      email,
      password,
      name,
      phone,
      gender,
      birthday,
    });
    return await this.userRepository.save(user);
  }

  // 이름이랑 전화번호로 유저 찾기
  findUserByNameAndPhone(name: string, phone: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { name, phone },
    });
  }

  // 이메일로 유저 찾기
  findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // 아이디로 유저 찾기
  findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // 유저 정보 수정
  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
