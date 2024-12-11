// TODO: Define a City class with name and id properties
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4} from 'uuid'

uuidv4();

class City{
  id: string;
  name: string;

  constructor(id: string , name: string ){
    this.id= id;
    this.name = name;

  }
}
// TODO: Complete the HistoryService class

class HistoryService {
  private filePath:string;

  constructor(){
    this.filePath = path.join(path.dirname(new URL(import.meta.url).pathname),'searchHistory.json');

  }





  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read():
  
  async read ():Promise<City[]> {
    try {
        const data = await fs.readFile(this.filePath,'utf-8');
        return JSON.parse(data); 
    } catch (error) {
      console.error('Error reading search history:', error);
      return[];

    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
async write(cities:City[]): Promise<void> {

  try{
    const data = JSON.stringify(cities, null,2);
    await fs.writeFile(this.filePath, data);
  }catch (error){
    console.error('Error writing the file:', error);

  }
}
   


  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
   try {
    const data = await fs.readFile(this.filePath, 'utf-8');
    const cities = JSON.parse (data);
    return cities as City[];
   } catch (error) {
    console.error('Error reading cities:', error); 
    return [];

   }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {

    try {
    const cities = await this.getCities();
    const newCity = new City(uuidv4(),cityName);
    cities.push(newCity);
    await this.write(cities);
    } catch (error) {
      console.error('Errpor adding city:',error);
    }
  };
}


  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}


export default new HistoryService();
