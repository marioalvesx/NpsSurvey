import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
import { AppError } from "../errors/AppError";

class SendMailController {    
    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({
            email
        });

        if(!user){
            throw new AppError("User does not exists!");
        }

        const survey = await surveysRepository.findOne({
            id: survey_id,
        });

        if(!survey){
            throw new AppError("Survey does not exists!");
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value: null}, // colchetes aqui transforma a query em OR. Assim como está fica condicional OR
            relations: ["user", "survey"],
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "", // Validação do serverUser: Cria a variável, 1º
            link: process.env.URL_MAIL,
        };

        if(surveyUserAlreadyExists){
            variables.id = surveyUserAlreadyExists.id; // 2º, se existir, atribui o valor do ID do serverUser existente
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        // Salvar informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id,
        });      

        await surveysUsersRepository.save(surveyUser);
        
        // Enviar e-mail para o usuario
        variables.id = surveyUser.id; // Se não existir, atribui o ID do usuário novo
        
        await SendMailService.execute(email, survey.title, variables, npsPath);
        // Agora é trazido o nome do usuário no email da enquete da pesquisa

        return response.json(surveyUser);
    }
}

export { SendMailController }