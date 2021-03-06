const fs = require('fs');
const figlet = require('figlet');
const clear = require('clear');
const chalk = require('chalk');
const dateFormat = require('dateFormat');
const inquirer = require('inquirer');
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

/**
 * Calculates the number of days between two dates.
 * @ param {string} start - The start date (mmddyyyy)
 * @ param {string} end - The end date (mmddyyyy)
 * @ returns {number} - The number of days between start and end
 */
function dateDiff(start, end) {
  return Math.floor((Date.parse(end) - Date.parse(start)) / -86400000);
}

/**
 * Displays the prompt and saves the dates to /temp/dates/daterange.csv
 */
function display() {
  const questions = [
    {
      type: 'datetime',
      name: 'start',
      message: 'Start date:',
      format: ['mm', '/', 'dd', '/', 'yyyy'],
      date: {
        min: '6/20/1995'
      }
    },
    {
      type: 'datetime',
      name: 'end',
      message: 'End date:',
      format: ['mm', '/', 'dd', '/', 'yyyy'],
      date: {
        min: '6/21/1995'
      }
    }
  ];

  inquirer
    .prompt(questions)
    .then(answers => {
      if (dateDiff(answers.start, answers.end) < 51) {
        const start = dateFormat(answers.start, 'yymmdd');
        const end = dateFormat(answers.end, 'yymmdd');
        fs.writeFileSync(
          './temp/dates/daterange.csv',
          start.toString() + ',' + end.toString(),
          'utf-8'
        );
      } else {
        console.log(
          chalk.red(
            'Make sure there are no more than 50 days between your start and end dates'
          )
        );
        display();
      }
    })
    .catch(error => console.error(error));
}

clear();
console.log(
  chalk.blue(
    figlet.textSync('Astronomy\nPicture\nof the\nDay', {
      horizontalLayout: 'default'
    })
  )
);

display();

process.on('SIGINT', () => {
  console.log('Caught interrupt signal');
  process.exit(1);
});
