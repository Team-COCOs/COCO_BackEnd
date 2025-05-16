import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { User, Gender, UserRole } from "./users.entity";
import { SearchUserDto } from "./dto/searchUsers.dto";
import { MiniroomsService } from "src/minirooms/minirooms.service";
import { MinihomepisService } from "src/minihomepis/minihomepis.service";
import { UseritemsService } from "src/useritems/useritems.service";
import { PhotosService } from "src/photos/photos.service";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly miniroomService: MiniroomsService,
    private readonly minihomepiService: MinihomepisService,
    private readonly useritemsService: UseritemsService,

    private readonly photosService: PhotosService
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
      dotoris: 50,
      birthday,
    });

    const savedUser = await this.userRepository.save(user);

    // 미니홈피 생성
    const minihomepi = await this.minihomepiService.saveMinihomepi(
      savedUser.id
    );

    // 미니룸 생성
    const miniroom = await this.miniroomService.saveMiniroom(savedUser.id);

    // 유저 아이템 생성 (탭 기본값 포함)
    const createdItem = await this.useritemsService.getOrCreateUserItem(
      savedUser.id
    );

    // 폴더 생성
    const photoFolder = await this.photosService.createDefaultFolders(
      savedUser.id
    );

    savedUser.minihomepi = minihomepi;
    savedUser.miniroom = miniroom;

    return await this.userRepository.save(savedUser);
  }

  // 이름이랑 전화번호로 유저 찾기
  findUserByNameAndPhone(name: string, phone: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { name, phone },
    });
  }

  // 이메일로 유저 찾기
  async findUserByEmail(
    email: string,
    options?: { withPassword: boolean }
  ): Promise<User | null> {
    if (options?.withPassword) {
      return this.userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.email = :email", { email })
        .getOne();
    }
    return this.userRepository.findOne({ where: { email } });
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

  // 유저 프로필 수정
  async updateMinimiImage(userId: number, imageUrl: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("유저를 찾을 수 없습니다.");

    user.minimi_image = imageUrl;
    await this.userRepository.save(user);
  }

  // 유저 검색
  async searchUsers(keyword: string): Promise<SearchUserDto[]> {
    if (!keyword.trim()) {
      return [];
    }

    return this.userRepository.find({
      select: ["id", "name", "minimi_image", "gender", "birthday"],
      where: {
        name: ILike(`%${keyword}%`),
        // 대소문자 무시 LIKE
      },
      take: 20,
    });
  }

  // 모든 유저 아이디
  async getAllUserId(): Promise<{ id: number; name: string }[]> {
    const users = await this.userRepository.find({
      select: ["id", "name"],
    });
    return users;
  }

  // 탈퇴 유저 역할 변경
  async withdrawUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("유저가 존재하지 않습니다.");

    user.role = UserRole.WITHDRAWN;
    user.email = `withdrawn_${user.email}`;
    user.password = "";
    await this.userRepository.save(user);
  }
}
