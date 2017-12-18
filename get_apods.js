const Nightmare = require('nightmare');
const nightmare = Nightmare();
const fs = require('fs');

const data = fs.readFileSync('dates.csv', 'utf-8');
const dates = data.split(',');
console.log(dates);

dates.reduce((accumulator, date) => {
  return accumulator.then(() => {
    return nightmare
      .goto('https://apod.nasa.gov/apod/ap' + date.toString() + '.html')
      .wait('body > p')
      .evaluate(() => {
        return document.querySelector('body > p').textContent.trim();
      })
      .then(result => {
        const entry = {
          date: date,
          picture: `./lib/pictures/${date}.jpg`,
          explanation: result.replace(/\n|Explanation:/g, ' ')
        };

        fs.readFile(
          './lib/explanations/explanations.json',
          'utf8',
          (error, data) => {
            if (error) throw error;

            let jsonData = JSON.parse(data);

            jsonData.elements.push(entry);

            fs.writeFile(
              './lib/explanations/explanations.json',
              JSON.stringify(jsonData, null, 4),
              error => {
                if (error) throw error;
                console.log('The explanation has been saved.');
              }
            );

            return nightmare
              .evaluate(() => {
                return document.querySelector(
                  'body > center:nth-child(1) > p:nth-child(3) > a > img'
                );
              })
              .then(result => {
                if (result !== null) {
                  // check if the page contains an image, else assume it contains an embedded video
                  return nightmare
                    .click(
                      'body > center:nth-child(1) > p:nth-child(3) > a > img'
                    )
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
                    .wait(
                      'body > center:nth-child(1) > p:nth-child(3) > iframe'
                    )
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
                          console.log(
                            `The picture ${date}.jpg has been saved.`
                          );
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
          }
        );
      });
  });
}, Promise.resolve());

nightmare.end();
