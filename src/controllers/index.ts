import { GitController } from './GitController';
import { TryController } from './Try';
import { Covid19 } from './covidap';

const gitController = new GitController();
const tryCon = new TryController()
const covidap = new Covid19();

export {
    gitController,
    tryCon,
    covidap
};