"use strict";

const fs = require("fs");
let { render } = require("mustache");

const args = process.argv.slice(2);
let fileName;

if (Object.keys(args).length === 0) {
  fileName = "recipes-500";
} else {
  fileName = args[0];
}

fs.unlink(`data/${fileName}-output.json`, (err) => {
  if (err) {
    console.log("new File, nice");
    return;
  }
});

let rawData = fs.readFileSync(`data/${fileName}.json`);
let data = JSON.parse(rawData);

let recipes = [];

let i = 0;
data.items.forEach((element) => {
  // filter out all recipes for the thermomix
  if (element.author && element.author == "thermomix") return;
  if (element.comment && element.comment.includes("thermomix")) return;

  i++;
  console.log(i);
  console.log(element.slug);
  const recipe = (({
    seoName,
    descriptionMarkdown,
    prepTime,
    totalTime,
    imageLink,
    slug,
    steps,
    websiteUrl,
  }) => ({
    seoName,
    descriptionMarkdown,
    prepTime,
    totalTime,
    imageLink,
    slug,
    steps,
    websiteUrl,
  }))(element);

  let template = `---
title: ${recipe.seoName}
image: ${recipe.imageLink}
sourceURL: ${recipe.websiteUrl}
servings: 2
time: ${recipe.totalTime}
---

${recipe.descriptionMarkdown}
`;

  //   console.log(recipe);
  recipes.push(recipe);

  let output = render(template, element);
  fs.writeFileSync(`./recipes/${recipe.slug}.md`, output);
});

let jsonContent = JSON.stringify(recipes);

fs.writeFile(
  `data/${fileName}-output.json`,
  jsonContent,
  "utf8",
  function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  }
);
