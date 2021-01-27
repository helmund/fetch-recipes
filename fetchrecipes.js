const fetch = require("node-fetch");
const fs = require('fs');
require('dotenv').config();

async function fetchRecipes(offset) {

    const token = process.env.BEARER;

    const response = await fetch(`https://gw.hellofresh.com/api/recipes/search?offset=${offset}&limit=250&locale=de-DE&country=de`, {headers: {
        'Authorization': `Bearer ${token}`
    }});

    const data = await response.json()
    const jsonData = JSON.stringify(data);
    const total = data.total;
    
    if ( offset >= total) {
        return false
    }

    var offset = offset + 250;


    fs.writeFile(`data/recipes-${offset}.json`, jsonData, (err) => {
        if (err) {
            throw err;
        }

        console.log(`JSON recipes-${offset} saved`)
    })

    fetchRecipes(offset)
}

fetchRecipes(0);