import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const {cityName} = req.body;
    if(!cityName) {
      return res.status(400).json({error: 'City name is required'});
    
    }
// TODO: GET weather data from city name
    try {
      const weatherData = await WeatherService.getWeatherForCity(cityName);
    
  
  // TODO: save city to search history
  await HistoryService.addCity(cityName);


  return res.status(200).json(weatherData);
} catch (error){
    console.error(error);
    return res.status(500).json({error: 'AN error occured while fetching weather data'});
}});

// TODO: GET search history
router.get('/history', async (_, res: Response) => {
  try{
const history = await HistoryService.getCities();
    
return res.status(200).json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching search history' });
  
  }
});


// * BONUS TODO: DELETE city from search history


export default router;
