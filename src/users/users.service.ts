import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike, Not, In } from "typeorm";
import { User, Gender, UserRole } from "./users.entity";
import { SearchUserDto } from "./dto/searchUsers.dto";
import { MiniroomsService } from "src/minirooms/minirooms.service";
import { MinihomepisService } from "src/minihomepis/minihomepis.service";
import { UseritemsService } from "src/useritems/useritems.service";
import { PhotosService } from "src/photos/photos.service";
import * as bcrypt from "bcrypt";
import { DiaryService } from "src/diary/diary.service";
import { addHours, format, startOfDay } from "date-fns";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly miniroomService: MiniroomsService,
    private readonly minihomepiService: MinihomepisService,
    private readonly useritemsService: UseritemsService,
    private readonly photosService: PhotosService,
    private readonly diaryService: DiaryService
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

    const diaryFolder = await this.diaryService.createDefaultFolders(
      savedUser.id
    );

    savedUser.minihomepi = minihomepi;
    savedUser.miniroom = miniroom;

    return await this.userRepository.save(savedUser);
  }

  // 비밀번호 변경
  async changePw(
    userId: number,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: "비밀번호가 성공적으로 변경되었습니다." };
  }

  // 전화번호 변경
  async changePhone(
    userId: number,
    newPhone: string
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다.");
    }

    user.phone = newPhone;
    await this.userRepository.save(user);

    return { message: "전화번호가 성공적으로 변경되었습니다." };
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
      select: ["id", "name", "minimi_image", "gender", "birthday", "role"],
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
    user.name = `${user.name} (탈퇴)`;
    user.email = `withdrawn_${Date.now()}_${user.email}`;
    user.password = null;
    user.phone = null;
    await this.userRepository.save(user);
  }

  // 탈퇴 유저 확인
  async getUserRole(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("유저가 존재하지 않습니다.");
    return {
      id: user.id,
      role: user.role,
    };
  }

  // 파도타기 (현재 있는 미니홈피 말고 랜덤하게 하나)
  async getRandomUserExcept(excludeId: number): Promise<number> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id != :excludeId", { excludeId })
      .andWhere("user.role = :role", { role: "user" })
      .orderBy("RAND()") // MySQL용 랜덤 정렬
      .limit(1)
      .getOne();

    if (!user) {
      throw new NotFoundException("다른 유저가 없습니다.");
    }

    return user.id;
  }

  // 관리자용
  async findAllUser() {
    const users = await this.userRepository.find();

    return users.map((user) => {
      const createdAtKST = addHours(user.created_at, 9);
      const joinDate = format(createdAtKST, "yyyy-MM-dd");

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        joinDate,
      };
    });
  }

  // 총 가입자 수
  async getUserCount() {
    return this.userRepository.count({
      where: {
        role: Not(In([UserRole.ADMIN, UserRole.WITHDRAWN])),
      },
    });
  }

  // 일별 가입자 수
  async countTodaySignups(): Promise<number> {
    const now = new Date();
    const koreaNow = addHours(now, 9);
    const startOfTodayKST = startOfDay(koreaNow);
    const startOfTodayUTC = addHours(startOfTodayKST, -9);

    const raw = await this.userRepository
      .createQueryBuilder("user")
      .select("COUNT(*)", "count")
      .where("user.created_at >= :todayStart", { todayStart: startOfTodayUTC })
      .andWhere("user.role NOT IN (:...excludedRoles)", {
        excludedRoles: [UserRole.ADMIN, UserRole.WITHDRAWN],
      })
      .getRawOne<{ count: string }>();

    return parseInt(raw.count, 10);
  }

  // 월별 가입자 수
  async countMonthlySignups(): Promise<{ month: string; count: number }[]> {
    const raw = await this.userRepository
      .createQueryBuilder("user")
      .select(
        `DATE_FORMAT(DATE_ADD(user.created_at, INTERVAL 9 HOUR), '%Y-%m')`,
        "month"
      )
      .addSelect("COUNT(*)", "count")
      .where("user.created_at IS NOT NULL")
      .andWhere("user.role NOT IN (:...excludedRoles)", {
        excludedRoles: [UserRole.ADMIN, UserRole.WITHDRAWN],
      })
      .groupBy("month")
      .orderBy("month", "ASC")
      .getRawMany<{ month: string; count: string }>();

    return raw.map((row) => ({
      month: row.month,
      count: parseInt(row.count, 10),
    }));
  }

  // 관리자용 유저 삭제
  async deleteUser(params: {
    targetUserId: number;
    requester: { id: number; role: UserRole };
  }): Promise<User> {
    const { targetUserId, requester } = params;

    if (requester.role !== UserRole.ADMIN) {
      throw new ForbiddenException("관리자만 유저를 삭제할 수 있습니다.");
    }

    const user = await this.userRepository.findOne({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다.");
    }

    return this.userRepository.remove(user);
  }
}
