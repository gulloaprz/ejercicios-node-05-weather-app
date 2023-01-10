import axios from "axios";
import colors from "colors";
import fs from "fs";

class Searchs
{
    historical = [];
    dbPath  = "./db/database.json";

    constructor()
    {        
        this.loadDB();
    }

    get paramsMapBox()
    {
        return {
            access_token: process.env.MAPBOX_KEY,
            limit:5,
            language:"es"
        }
    }

    get paramsOpenWeather()
    {
        return {
            appid: process.env.OPEN_WEATHER_KEY,
            lang:"es",
            units:"metric"
        }
    }

    async citys(terms = '')
    {
        try
        {
            const instance = axios.create(
            {
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${terms}.json`,
                params: this.paramsMapBox
            });
            const response = await instance.get();
            return response.data.features.map(place => ({
                id:place.id,
                name:place.place_name,
                lng:place.center[0],
                lat:place.center[1]
            }));
        }
        catch(error)
        {
            console.log("ERROR".red, error)
            return [];
        }
    }

    async weatherCoordinates(lat, lon)
    {
        try 
        {
            const instance = axios.create(
                {
                    baseURL : "https://api.openweathermap.org/data/2.5/weather",
                    params  :  {...this.paramsOpenWeather, lat, lon}
                });

            const response = await instance.get();
            
            return {
                description : response.data.weather[0].description,
                temperature : response.data.main.temp,
                minimum     : response.data.main.temp_min,
                maximum     : response.data.main.temp_max
            }
        } 
        catch (error) {
            console.log("ERROR".red, error);
        }
    }

    showHistorical()
    {
        this.historical.forEach((place, idx) => {
            let words = place.split(" ").map(word => {
                return word.charAt(0).toUpperCase() + word.substring(1);
            });
            
            console.log(colors.green(idx + 1), words.join(" "));
        });
    }

    async saveHistorical(place = "")
    {
        if(!this.historical.includes(place.toLocaleLowerCase()))
        {
            this.historical.unshift(place.toLowerCase());
            this.saveDB();
        }
    }

    saveDB()
    {
        const payload = {
            historical:this.historical
        }
        
        this.historical.splice(0,15);

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    
    loadDB()
    {
        if(!fs.existsSync(this.dbPath))
        {
            return
        }
        const data = fs.readFileSync(this.dbPath, {encoding:"utf-8"});
        const json = JSON.parse(data);
        this.historical = json.historical;
    }
}

export { Searchs }