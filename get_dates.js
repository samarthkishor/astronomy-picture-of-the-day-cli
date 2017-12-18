const fs = require('fs');
const figlet = require('figlet');
const clear = require('clear');
const chalk = require('chalk');
const dateFormat = require('dateFormat');
const inquirer = require('inquirer');
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

/**
 * Returns an array of all the dates between two yymmdd formatted dates
 * @ param {string} start - The start date (yymmdd)
 * @ param {string} end - The end date (yymmdd)
 */
// function getDates(start, end) {
//   let date = Number(start);
//   let dates = [];
//   let days_in_month = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//   end = Number(end);
//   dates.push(start);

//   async.whilst(
//     () => {
//       return date < end;
//     },
//     callback => {
//       console.log('tick');
//       let year = Number(date.toString().slice(0, 2));
//       let day = Number(date.toString().slice(4));
//       let month = Number(date.toString().slice(2, 4));

//       if (month < 9) {
//         // account for leap years
//         if (month == 2 && year % 4 == 0) {
//           if (day < 29) {
//             date += 1;
//           } else {
//             month += 1;
//             date = Number(year.toString() + '0' + month.toString() + '01');
//           }
//         } else if (day < days_in_month[month]) {
//           date += 1;
//           getDates(date, end);
//         } else {
//           month += 1;
//           date = Number(year.toString() + '0' + month.toString() + '01');
//         }
//         dates.push(date.toString());
//       } else if (9 <= month < 12) {
//         if (day < days_in_month[month]) {
//           date += 1;
//         } else {
//           month += 1;
//           date = Number(year.toString() + '0' + month.toString() + '01');
//         }
//         dates.push(date.toString());
//       } else if (month == 12) {
//         if (day < days_in_month[month]) {
//           date += 1;
//         } else {
//           year += 1;
//           date = Number(year.toString() + '0101');
//         }
//         dates.push(date.toString());
//       }
//       process.nextTick(callback);
//     },
//     err => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       console.log(dates);
//       return dates;
//     }
//   );
// }

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
    }
  })
  .catch(error => console.error(error));
