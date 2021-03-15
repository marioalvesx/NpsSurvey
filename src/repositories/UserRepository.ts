import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/User";

@EntityRepository(User)
class UsersRepository extends Repository<User> { // Usa a herança da classe User dentro das models passando a entidade de User
    
}

export { UsersRepository };
