import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {

    async execute(request: Request, response: Response){
       const { value } = request.params;
       const { u } = request.query;

       const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

       const surveyUser = await surveysUsersRepository.findOne({
           id: String(u) // Força o ID a parsear o valor para String
       });

       if(!surveyUser) {
            throw new AppError("Survey User does not exists!");
       }

       surveyUser.value = Number(value); // Força o campo value a ficar com tipo Number

       await surveysUsersRepository.save(surveyUser);

       return response.json(surveyUser);

    }
}

export { AnswerController }