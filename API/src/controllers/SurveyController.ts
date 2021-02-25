import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from "../repositories/SurveysRepository"

class SurveyController{
    async create(req: Request, res: Response){
        const { title, description } = req.body;
        
        const surveysRepository = getCustomRepository(SurveysRepository);

        const newSurvey = surveysRepository.create({
            title,
            description
        });

        await surveysRepository.save(newSurvey);
        
        return res.status(201).json(newSurvey);
    }

    async show(req: Request, res: Response){
        const surveysRepository = getCustomRepository(SurveysRepository);

        const allRepositories = await surveysRepository.find();

        return res.json(allRepositories)
    }
}

export { SurveyController }