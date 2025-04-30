import { Repository } from "typeorm";
import { User, Gender } from "./users.entity";
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    saveUser(email: string, password: string, name: string, phone: string, gender: Gender, birthday: string): Promise<User>;
    findUserByNameAndPhone(name: string, phone: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserById(id: number): Promise<User | null>;
    save(user: User): Promise<User>;
}
