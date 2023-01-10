
import * as dotenv from 'dotenv'
dotenv.config()

import { readInput, inquirerMenu, pause, listPlaces} from "./helpers/inquirer.js";
import { Searchs } from "./models/searchs.js";
import axios, {isCancel, AxiosError} from 'axios';

const main = async() =>
{
    const searchs = new Searchs();

    let option = null;
    do
    {
        option = await inquirerMenu();

        switch (option) 
        {
            case 1:
                // Show messages
                const terms = await readInput("City: ");
                // Search places
                const places = await searchs.citys(terms);
                // Select place
                const selectedId = await listPlaces(places); 
                
                if(selectedId === 0)
                {
                    continue;
                }

                const selectedPlace = places.find(p => p.id === selectedId);

                
                // Save DB
                searchs.saveHistorical(selectedPlace.name);

                // Search weather
                const weather = await searchs.weatherCoordinates(selectedPlace.lat, selectedPlace.lng);
                //  Show results
                console.log("==============================".green);
                console.log("       City information".green);
                console.log("==============================\n".green);
                console.log("City:".green, selectedPlace.name);
                console.log("Lat:".green, selectedPlace.lat);
                console.log("Lng:".green, selectedPlace.lng);
                console.log("How is the weather:".green, weather.description);
                console.log("Temperature:".green, weather.temperature);
                console.log("Minimum Temperature:".green, weather.minimum);
                console.log("Maximum Temperature:".green, weather.maximum);
                break;
            
            case 2:
                searchs.showHistorical();
            default:
                break;
        }
        
        if(option !== 0)
        {
            await pause();
        }

    }while(option !== 0)
}

main();