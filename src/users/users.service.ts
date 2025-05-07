import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { User, Gender } from "./users.entity";
import { SearchUserDto } from "./dto/users.dto";
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
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .addSelect("user.password")
      .getOne();
  }

  // 아이디로 유저 찾기
  findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // 전화번호로 유저 찾기
  findUserByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  // 유저 정보 수정
  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  // 유저 검색
  async searchUsers(keyword: string): Promise<SearchUserDto[]> {
    if (!keyword.trim()) {
      return [];
    }

    return this.userRepository.find({
      select: ["id", "name", "profile_image", "gender", "birthday"],
      where: {
        name: ILike(`%${keyword}%`),
        // 대소문자 무시 LIKE
      },
      take: 20,
    });
  }
}
