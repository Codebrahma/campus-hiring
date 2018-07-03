"use strict";

const { Builder, By, until } = require('selenium-webdriver');

const driver = new Builder()
  .forBrowser('chrome')
  .build();

let solution1Passed = false;
let solution2Passed = false;

const checkSolution1 = () => {
  let borderRadius, backgroundColor;

  driver.switchTo().frame(driver.findElement(By.tagName('iframe')));
  var square = driver.findElement(By.id('square'));
  var button = driver.findElement(By.id('button'));

  square
    .getCssValue('border-radius')
    .then((value) => { borderRadius = value; });
  square
    .getCssValue('background-color')
    .then((value) => { backgroundColor = value; });

  button.click();

  square
    .getCssValue('border-radius')
    .then((value) => {
      if (borderRadius !== value && parseInt(value) > 45) { return; }
      throw new Error('Square is not changed to circle on clicking the button');
    });

  square
    .getCssValue('background-color')
    .then((value) => {
      if (backgroundColor !== value) { return; }
      throw new Error('Background color is not changed on clicking the button');
    });

  return driver.wait(until.titleIs('JSFiddle'), 1500);
}

const checkSolution2 = () => {
  let borderRadius, backgroundColor;

  driver.switchTo().frame(driver.findElement(By.tagName('iframe')));
  const parent = driver.findElement(By.className('parent'));
  let elementsLength = 0;

  parent.findElements(By.tagName('ul')).then((elements) => {
    elementsLength = elements.length;
  });

  parent.click();

  parent.findElements(By.tagName('ul')).then((elements) => {
    if (elementsLength + 1 === elements.length) {
      const child = driver.findElement(By.className('child'));
      elementsLength = 0;

      child.findElements(By.tagName('ul')).then((childElements) => {
        elementsLength = childElements.length;
      });

      child.click();

      child.findElements(By.tagName('ul')).then((childElements) => {
        if (elementsLength + 1 === childElements.length) { return; }
        throw new Error('Not adding grand children on clicking child');
      });

      return;
    }

    throw new Error('Not adding children on clicking parent');
  });

  return driver.wait(until.titleIs('JSFiddle'), 1500);
}

const passSolution1 = () => {
  solution1Passed = true;
}

const passSolution2 = () => {
  solution2Passed = true;
}

const handleFailure = (err) => {
  console.error('Something went wrong!\n', err.stack, '\n');
  quitDriver();
}

const quitDriver = () => {
  console.log("WebDriver is about to close.");
  driver.quit();
}

const problem1 = () => (
  new Promise((resolve, reject) => {
    driver.get('https://fiddle.jshell.net/ay2xv5s9/show/light/');
    driver.wait(checkSolution1, 2500).then(resolve, reject);
  })
  .then(passSolution1)
  .catch(handleFailure)
);

const problem2 = () => (
  new Promise((resolve, reject) => {
    driver.get('https://fiddle.jshell.net/94sxgzkp/show/light/');
    driver.wait(checkSolution2, 2500).then(resolve, reject);
  })
  .then(passSolution2)
  .catch(handleFailure)
);

problem1().then(problem2).then(quitDriver).catch(handleFailure);

