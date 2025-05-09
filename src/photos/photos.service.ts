import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { Photo } from "./photos.entity";
import { NewPhotoDto } from "./dto/photos.dto";
import { PhotoFolder } from "./photoFolder.entity";

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,

    @InjectRepository(PhotoFolder)
    private readonly photoFolderRepository: Repository<PhotoFolder>
  ) {}

  async getNewPhotos(userId: number): Promise<NewPhotoDto[]> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const photos = await this.photoRepository.find({
      where: {
        user: { id: userId },
        created_at: MoreThan(todayStart),
      },
      order: { created_at: "DESC" },
      take: 10,
    });

    const mappedPhotos: NewPhotoDto[] = photos.map((p) => ({
      id: p.id,
      folderName: p.folder?.title ?? "기타",
      photoUrl: p.photo_url,
      title: p.title,
      content: p.content,
      createdAt: p.created_at.toISOString().replace("T", " ").substring(0, 16),
      type: "photo",
    }));
    return mappedPhotos;
  }
}
