import inquirer from "inquirer";
import colors from "colors";

const mainMenu = 
[
    {
        type : "list",
        name : "option",
        message : "Qué desa hacer?",
        choices : 
        [
            {
                value : 1,
                name : `${'1.'.green} Buscar ciudad`,
            },
            {
                value : 2,
                name : `${'2.'.green} Historial`,
            },
            {
                value : 0,
                name : `${'0.'.green} Salir`,
            },
        ]
    }
];


const inquirerMenu = async() =>
{
    console.clear();
    console.log("======================================".white);
    console.log("        Seleccione una opción".white);
    console.log("======================================\n".white);

    const { option } = await inquirer.prompt(mainMenu);

    return option;
}

const pause = async () => 
{
    const pauscnfg = 
    [
        {
            type : "input",
            name : "opcion",
            message : `Presione ${"ENTER".green} para continuar`,
        }
    ];
    await inquirer.prompt(pauscnfg);

    console.log("\n");
}

const readInput = async (message) =>
{
    const question = 
    [
        {
            type:"input",
            name:"description",
            message,
            validate(value)
            {
                if(value.trim().length === 0)
                {
                    return "Please enter a value";
                }

                return true;
            }
        }
    ];

    const { description } = await inquirer.prompt(question);

    return description;
}

const listPlaces = async (data = []) => 
{
    const choices = data.map( (item,idx) => 
    {
        return {
            name : `${colors.green(idx + 1)}. ${item.name}`,
            value : item.id,
        };
    });

    choices.unshift({
        name:"0. Cancelar",
        value: 0
    });

    const options  = 
    [
        {
            type : "list",
            name : "id",
            message:"Select place",
            choices
        }
    ];

    const { id } = await inquirer.prompt(options);
    return id;
}

const listTasksCompleted = async (data = []) => 
{
    const choices = data.map( (item,idx) => 
    {
        return {
            name : `${colors.green(idx + 1)}. ${item.description}`,
            value : item.id,
            checked : item.completedAt !== null
        };
    });

    const tasks = 
    [
        {
            type : "checkbox",
            name : "ids",
            choices
        }
    ];

    const { ids } = await inquirer.prompt(tasks);
    return ids;
}


const confirmAction = async(message) =>
{
    const question = 
    [
        {
            type:'confirm',
            name:'ok',
            message

        }
    ];

    const { ok } = await inquirer.prompt(question);

    return ok;
}

export
{
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    listTasksCompleted,
    confirmAction
}