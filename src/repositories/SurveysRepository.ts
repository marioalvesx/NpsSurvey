
import { EntityRepository, Repository } from "typeorm";
import { Survey } from "../models/Survey";

@EntityRepository(Survey)
class SurveysRepository extends Repository<Survey> { // Usa a herança da classe User dentro das models passando a entidade de User
    
}

export { SurveysRepository };
