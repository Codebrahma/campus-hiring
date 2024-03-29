"use strict";

const pg = require('pg-promise')();
const { Builder, By, until } = require('selenium-webdriver');
const driver = new Builder()
  .forBrowser('chrome')
  .build();

const waitForTitle = () => {
  return driver.getTitle().then((title) => title.includes('JSFiddle'));
}

const filterCandidates = (candidates) => {
  const jobs = candidates.map((candidate) => (
    () => new Promise((onDone, onError) => {
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

        return driver.wait(waitForTitle, 1500);
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

        return driver.wait(waitForTitle, 1500);
      }

      const passSolution1 = () => {
        solution1Passed = true;
      }

      const passSolution2 = () => {
        solution2Passed = true;
      }

      const handleFailure = (err) => {
        // console.error('Something went wrong!\t', err.stack, '\n');
      }

      const problem1 = () => (
        new Promise((resolve, reject) => {
          if (!candidate.circle_problem_js_fiddle_link) { return reject(Error('Problem not solved')); }
          driver.get(candidate.circle_problem_js_fiddle_link);
          driver.wait(checkSolution1, 2500).then(resolve, reject);
        })
        .then(passSolution1)
        .catch(handleFailure)
      );

      const problem2 = () => (
        new Promise((resolve, reject) => {
          if (!candidate.parent_child_problem_js_fiddle_link) { return reject(Error('Problem not solved')); }

          driver.get(candidate.parent_child_problem_js_fiddle_link);
          driver.wait(checkSolution2, 2500).then(resolve, reject);
        })
        .then(passSolution2)
        .catch(handleFailure)
      );

      problem1().then(problem2).then(() => {
        console.log(candidate.name + "\t" + candidate.email + "\t" + "Solution 1: " + solution1Passed + "\t" + "Solution 2: " + solution2Passed);
        onDone();
      });
    })
  ));

  jobs.reduce((job1, job2) => {
    return job1().then(job2);
  }, jobs.shift());
}

const config = {
  host: 'ec2-54-247-98-162.eu-west-1.compute.amazonaws.com',
  database: 'd44ooqcs90v6tl',
  user: 'izlwhxdvhmziab',
  port: 5432,
  password: '976a95e752f5b04a2c46a7f0497e54434b25885555a206076364f1e0e9adf29e',
  ssl: true
};

const db = pg(config);
db.any('SELECT * from candidates').then(filterCandidates);
