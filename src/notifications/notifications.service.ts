import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./notifications.entity";
import { User } from "../users/users.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  // 유저 알림 조회
  async findByUser(userId: number) {
    const notification = await this.notificationRepository.findAndCount({
      where: { receiver: { id: userId } } as any,
    });
    return { notification };
  }

  // 알림 생성
  async create(receiverUserId: number, message: string, senderUserId?: number) {
    const notification = this.notificationRepository.create({
      receiver: { id: receiverUserId } as User,
      sender: senderUserId ? ({ id: senderUserId } as User) : null,
      message,
    });

    return await this.notificationRepository.save(notification);
  }

  // 읽음 처리
  async markAsRead(userId: number) {
    await this.notificationRepository.update(
      { receiver: { id: userId }, isRead: false } as any,
      { isRead: true }
    );
  }

  // 안 읽은 알림 존재 여부
  async hasUnread(userId: number): Promise<boolean> {
    const count = await this.notificationRepository.count({
      where: { receiver: { id: userId }, isRead: false } as any,
    });
    return count > 0;
  }
}
