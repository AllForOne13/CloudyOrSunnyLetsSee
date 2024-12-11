import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();

 
// TODO: Define an interface for the Coordinates object
interface Coordinates {


  latitude: number;
  longitude: number;
  displayCoordinates(): void;
  getLatitude(): number;
  getLongitude(): number;

}



class CoordinateImpl implements Coordinates {
  constructor(public latitude: number, public longitude: number){}

    getLatitude(): number {
      return this.latitude;
    }
  
    getLongitude(): number {
      return this.longitude;
    }

    displayCoordinates(): void {
      console.log(`Coordinates:Latitude ${this.getLatitude()}, Longitude ${this.getLongitude()}`);
    }
  }


// TODO: Define a class for the Weather object
interface WeatherInfo {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  
}

class WeatherInfoImpl implements WeatherInfo {
  constructor(
    public temperature: number,
    public humidity: number,
    public windSpeed: number,
    public description: string
  ) {}

  displayWeather(): void {
    console.log(`Weathern Info:
      Temperature: ${this.temperature}C,
      Humidity: ${this.humidity}%,
      Wind Speed: ${this.windSpeed} m/s,
      Description: ${this.description}`)
  }
};


// TODO: Complete the WeatherService class


class WeatherService {
  private baseURL: string;
  private apiKeys: string;
 
// use query to generate city name-> gen lat & lon -> gen forcast
   
  
  // TODO: Define the baseURL, API key, and city name properties
  constructor(){
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKeys = process.env.API_KEY || "";
  
    
}



  // TODO: Create buildGeocodeQuery method
   private buildGeocodeQuery(): string {
    const geocodeBaseURL = 'https://api.openweathermap.org/data/2.5/weather';
    return `${geocodeBaseURL}?q=$&appid=${this.apiKeys}`;
   
   }
   
  // TODO: Create buildWeatherQuery method
   private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}?lat=${coordinates.getLatitude()}&lon=${coordinates.getLongitude()}&appid=${this.apiKeys}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    try {
      const geocodeQuery = this.buildGeocodeQuery();
      const response = await axios.get(geocodeQuery);
      
      // Destructure latitude and longitude from the response
      const { lat, lon } = response.data.coord;
  
      // Create a Coordinates object and return it
      const coordinates = new CoordinateImpl(lat, lon);
      return coordinates;
    } catch (error) {
      console.error('Failed to fetch and destructure location data:', error);
      throw new Error('Failed to fetch location data');
    }
  }

  
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(weatherData: any): WeatherInfo {
    const temperature = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const description = weatherData.weather[0].description;

    return new WeatherInfoImpl(temperature, humidity, windSpeed, description);
  }

  // TODO: Create fetchWeatherData method 
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
        const weatherQuery = this.buildWeatherQuery(coordinates);
        const weatherResponse = await axios.get(weatherQuery);
        
        // Return the entire weather data response
        const weatherData = weatherResponse.data; // Get the complete weather data object
        
        // Use the first item in the list to get the current weather data
        const currentWeatherData = weatherData.list[0];
        
        // Call parseCurrentWeather to process the current weather data
        const currentWeather = this.parseCurrentWeather(currentWeatherData);
        
        // Return the complete weather data and the parsed current weather
        return { currentWeather, weatherData: weatherData.list }; // Return both the current weather and the full weather data
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        throw new Error('Failed to fetch weather data');
    }
}


// TODO: Complete buildForecastArray method
private buildForecastArray(currentWeather: WeatherInfo, weatherData: any[]): WeatherInfo[] {
  const forecast: WeatherInfo[] = [];

  forecast.push(currentWeather);

  for (const data of weatherData) {
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const description = data.weather[0].description;

      const weatherInfo = new WeatherInfoImpl(temperature, humidity, windSpeed, description);
      forecast.push(weatherInfo);
  }

  return forecast;
}


    // TODO: Create fetchLocationData method

 private async fetchLocationData(): Promise<WeatherInfo> {
  try {
    const geocodeQuery = this.buildGeocodeQuery();
    const response = await axios.get(geocodeQuery);
    const { lat, lon } = response.data.coord;

    const weatherResponse = await axios.get(`${this.baseURL}?lat=${lat}&lon=${lon}&appid=${this.apiKeys}`);
    const weatherData = weatherResponse.data.list[0];
    const temperature = weatherData.main.temp;

      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const description = weatherData.weather[0].description;

      return {
        temperature,
        humidity,
        windSpeed,
        description
      };
    } catch (error) {
      console.error('Failed to fetch wather data');
      throw new Error('Failed to fetch weather data');
    }
  }



  async getWeatherForCity(city: string): Promise<WeatherInfo[]> { 
    try {
        console.log(`Fetching weather for city: ${city}`);
        const coordinates = await this.fetchAndDestructureLocationData();
        const weatherData = await this.fetchWeatherData(coordinates); 

        const currentWeather = await this.fetchLocationData(); 
        const forecastArray = this.buildForecastArray(currentWeather, weatherData.list); 
        
        return forecastArray; 
    } catch (error) {
        console.error('Error getting weather for city ${city}:', error);
        throw new Error('Could not retrieve weather data');
    }
}



  // TODO: Create destructureLocationData method

  destructureLocationData(location: Coordinates, ): Coordinates {
    const { latitude, longitude,  } = location;
    return new CoordinateImpl ( latitude, longitude);
  }
  async getWeatherData(): Promise<void> {
    try {
      const locationData = await this.fetchLocationData();
      console.log(locationData)
    } catch (error) {
      console.error('Failed to get weather data:', error);
    }
  }
}

export default new WeatherService();
