"use strict";

const {Builder, By, Key, until} = require('selenium-webdriver');

const driver = new Builder()
  .forBrowser('chrome')
  .build();

let solution1Passed = true;
let solution2Passed = true;

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
      solution1Passed = solution1Passed && (borderRadius !== value && parseInt(value) > 45);
    });

  square
    .getCssValue('background-color')
    .then((value) => { solution1Passed = solution1Passed && (backgroundColor !== value); });

  return driver.wait(until.titleIs('JSFiddle'), 1500);
}

const checkSolution2 = () => {
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
      solution1Passed = solution1Passed && (borderRadius !== value && parseInt(value) > 45);
    });

  square
    .getCssValue('background-color')
    .then((value) => { solution1Passed = solution1Passed && (backgroundColor !== value); });

  return driver.wait(until.titleIs('JSFiddle'), 1500);
}

const handleFailure = (err) => {
  console.error('Something went wrong!\n', err.stack, '\n');
  quitDriver();
}

const quitDriver = () => {
  // console.log('solution1Passed', solution1Passed);
  // console.log('solution2Passed', solution2Passed);

  console.log("WebDriver is about to close.");
  driver.quit();
}

driver.get('https://fiddle.jshell.net/ay2xv5s9/show/light/');
driver.wait(checkSolution1, 2500).then(quitDriver, handleFailure);

