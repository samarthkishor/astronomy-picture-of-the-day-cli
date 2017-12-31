const fs = require('fs');
const figlet = require('figlet');
const clear = require('clear');
const chalk = require('chalk');
const dateFormat = require('dateFormat');
const inquirer = require('inquirer');
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

clear();
console.log(
  chalk.blue(
    figlet.textSync('Astronomy\nPicture\nof the\nDay', {
      horizontalLayout: 'default'
    })
  )
);

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
    if (
      dateFormat(answers.end, 'yyyymmdd') -
        dateFormat(answers.start, 'yyyymmdd') <
      51
    ) {
      const start = dateFormat(answers.start, 'yymmdd');
      const end = dateFormat(answers.end, 'yymmdd');
      fs.writeFileSync(
        'daterange.csv',
        start.toString() + ',' + end.toString(),
        'utf-8'
      );
    } else {
      console.log(
        chalk.red(
          'Make sure there are no more than 50 days between your start and end dates'
        )
      );
      process.exit(1);
    }
  })
  .catch(error => console.error(error));

process.on('SIGINT', () => {
  console.log('Caught interrupt signal');
  process.exit(1);
});
