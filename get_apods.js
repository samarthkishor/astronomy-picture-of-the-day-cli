const Nightmare = require('nightmare');
const nightmare = Nightmare();
const vo = require('vo');
const fs = require('fs');

const data = fs.readFileSync('dates.csv', 'utf-8');
const dates = data.split(',');

function getExplanation(date) {
  return nightmare => {
    nightmare
      .goto('https://apod.nasa.gov/apod/ap' + date.toString() + '.html')
      .wait('body > p')
      .evaluate(() => {
        return document.querySelector('body > p').textContent.trim();
      });
  };
}

function getPicture(date) {
  return nightmare => {
    nightmare
      .evaluate(() => {
        return document.querySelector(
          'body > center:nth-child(1) > p:nth-child(3) > a > img'
        );
      })
      .then(result => {
        if (result !== null) {
          // check if the page contains an image, else assume it contains an embedded video
          return nightmare
            .click('body > center:nth-child(1) > p:nth-child(3) > a > img')
            .wait(5000)
            .screenshot(`./lib/pictures/${date}.jpg`)
            .then(() => {
              console.log(`The picture ${date}.jpg has been saved.`);
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          console.log('The media is an embedded video, not an image.');
          return nightmare
            .wait('body > center:nth-child(1) > p:nth-child(3) > iframe')
            .wait(3000) // wait for the video to render
            .evaluate(() => {
              return document
                .querySelector(
                  'body > center:nth-child(1) > p:nth-child(3) > iframe'
                )
                .getAttribute('src');
            })
            .then(result => {
              return nightmare
                .goto(result)
                .wait(3000) // wait for the video to enter fullscreen mode
                .screenshot(`./lib/pictures/${date}.jpg`)
                .then(() => {
                  console.log(`The picture ${date}.jpg has been saved.`);
                })
                .catch(error => {
                  console.error(error);
                });
            })
            .catch(error => {
              console.error(error);
            });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
}

console.log('Saving explanations and images...');

dates
  .reduce((accumulator, date) => {
    return accumulator.then(() => {
      return nightmare.use(getExplanation(date)).then(result => {
        const entry = {
          date: date,
          picture: `./lib/pictures/${date}.jpg`,
          explanation: result.replace(/\n|Explanation:/g, ' ')
        };
        let jsonData = JSON.parse(
          fs.readFileSync('./lib/explanations/explanations.json', 'utf-8')
        );
        jsonData.elements.push(entry);
        fs.writeFile(
          './lib/explanations/explanations.json',
          JSON.stringify(jsonData, null, 4),
          error => {
            if (error) throw error;
            console.log(`The explanation for ${date} has been saved.`);
          }
        );

        return nightmare.use(
          getPicture(date).catch(error => console.error(error))
        );
      });
    });
  }, Promise.resolve())
  .then(() => {
    nightmare.end(() => console.log('...done'));
  });

// dates.reduce((accumulator, date) => {
//   return accumulator.then(() => {
//     return nightmare
//       .goto('https://apod.nasa.gov/apod/ap' + date.toString() + '.html')
//       .wait('body > p')
//       .evaluate(() => {
//         return document.querySelector('body > p').textContent.trim();
//       })
//       .then(result => {
//         const entry = {
//           date: date,
//           picture: `./lib/pictures/${date}.jpg`,
//           explanation: result.replace(/\n|Explanation:/g, ' ')
//         };

//         fs.readFile(
//           './lib/explanations/explanations.json',
//           'utf8',
//           (error, data) => {
//             if (error) throw error;
//             let jsonData = JSON.parse(data);
//             console.log(jsonData.elements);
//             jsonData.elements.push(entry);
//             fs.writeFile(
//               './lib/explanations/explanations.json',
//               JSON.stringify(jsonData, null, 4),
//               error => {
//                 if (error) throw error;
//                 console.log('The explanation has been saved.');
//               }
//             );

//             return nightmare
//               .evaluate(() => {
//                 return document.querySelector(
//                   'body > center:nth-child(1) > p:nth-child(3) > a > img'
//                 );
//               })
//               .then(result => {
//                 if (result !== null) {
//                   // check if the page contains an image, else assume it contains an embedded video
//                   return nightmare
//                     .click(
//                       'body > center:nth-child(1) > p:nth-child(3) > a > img'
//                     )
//                     .wait(5000)
//                     .screenshot(`./lib/pictures/${date}.jpg`)
//                     .then(() => {
//                       console.log(`The picture ${date}.jpg has been saved.`);
//                     })
//                     .catch(error => {
//                       console.error(error);
//                     });
//                 } else {
//                   console.log('The media is an embedded video, not an image.');
//                   return nightmare
//                     .wait(
//                       'body > center:nth-child(1) > p:nth-child(3) > iframe'
//                     )
//                     .wait(3000) // wait for the video to render
//                     .evaluate(() => {
//                       return document
//                         .querySelector(
//                           'body > center:nth-child(1) > p:nth-child(3) > iframe'
//                         )
//                         .getAttribute('src');
//                     })
//                     .then(result => {
//                       return nightmare
//                         .goto(result)
//                         .wait(3000) // wait for the video to enter fullscreen mode
//                         .screenshot(`./lib/pictures/${date}.jpg`)
//                         .then(() => {
//                           console.log(
//                             `The picture ${date}.jpg has been saved.`
//                           );
//                         })
//                         .catch(error => {
//                           console.error(error);
//                         });
//                     })
//                     .catch(error => {
//                       console.error(error);
//                     });
//                 }
//               })
//               .catch(error => {
//                 console.error(error);
//               });
//           }
//         );
//       });
//   });
// }, Promise.resolve([]));

// // nightmare.end();
