import {resolve} from 'path';
import { AppError } from './../errors/AppError';
import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import SendMailService from '../services/SendMailService';

class SendMailController{
    async execute(req: Request, res: Response){
        const { email, survey_id } = req.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const user = await usersRepository.findOne({email});
        if(!user)
            throw new AppError("User does not exists!");

        const surveysRepository = getCustomRepository(SurveysRepository);
        const survey = await surveysRepository.findOne({id: survey_id});
        if(!survey)
            throw new AppError("Survey does not exists!");

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const surveyUsersAlreadyExists = await surveysUsersRepository.findOne({
            where: {    user_id: user.id,
                        value: null     },
            relations:  ["user", "survey"]
        });

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if(surveyUsersAlreadyExists){
            variables.id = surveyUsersAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return res.json(surveyUsersAlreadyExists);
        }

        const newSurveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })
        await surveysUsersRepository.save(newSurveyUser);
        variables.id = newSurveyUser.id;
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return res.json(newSurveyUser);
    }
}

export { SendMailController };