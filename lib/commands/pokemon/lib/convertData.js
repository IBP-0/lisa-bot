"use strict";

const fs = require("fs");
const _fetch = require("node-fetch");
const {
    forEach
} = require("lodash");
const flattenData = require("./flattenData");
const stripData = require("./stripData");

const INPUT_URL = "https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/";
const CACHE_DIR = "cache";
const OUTPUT_DIR = "data";

const filesToConvert = {
    abilities: "abilities",
    items: "items",
    moves: "moves",
    pokedex: "pokedex",
    typechart: "typechart",
    format: "formats-data"
};
const filesSaved = [];

//@TODO make this less hacky
/**
 * Currently the flow is:
 * - Load file from git repo
 * - Save it in cache folder
 * - Require it in node
 * - convert it
 * - save it to data folder
 *
 */
forEach(filesToConvert, (val, key) => {
    const fileURL = INPUT_URL + val + ".js";
    console.log("Starting Download", key, fileURL);

    filesSaved.push(new Promise((resolve, reject) => {
        _fetch(fileURL)
            .then(res => res.text())
            .then(fileContent => {
                console.log("Starting Conversion", key, fileURL);
                fs.writeFile(`${CACHE_DIR}/pokemon_${key}.js`, fileContent, err => {
                    if (err) {
                        reject(err);
                    } else {
                        const fileData = require(`../../../../${CACHE_DIR}/pokemon_${key}.js`);
                        const fileDataProcessed = stripData(flattenData(fileData));
                        const dataJSON = JSON.stringify({
                            data: fileDataProcessed
                        });

                        fs.writeFile(`${OUTPUT_DIR}/pokemon_${key}.json`, dataJSON, err => {
                            if (err) {
                                reject(err);
                            } else {
                                console.log("Completed Conversion", key, fileURL);
                                resolve();
                            }
                        });
                        resolve();
                    }
                });
            })
            .catch(reject);
    }));
});

Promise.all(filesSaved)
    .then(() => console.log("Finished converting"))
    .catch(err => {
        throw err;
    });
