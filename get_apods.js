const Nightmare = require('nightmare');
const nightmare = Nightmare();
const vo = require('vo');
const fs = require('fs');

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

function* run() {
  console.log('Saving explanations and images...');

  const data = fs.readFileSync('dates.csv', 'utf-8');
  const dates = data.split(',');

  for (let i = 0; i < dates.length; i++) {
    let date = dates[i];
    yield nightmare.use(getExplanation(date)).then(result => {
      // Save the explanation to explanations.json
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

      return nightmare
        .evaluate(() => {
          return document.querySelector(
            'body > center:nth-child(1) > p:nth-child(3) > a > img'
          );
        })
        .then(result => {
          // Check if the page contains an image, else assume it contains an embedded video
          if (result !== null) {
            return nightmare
              .click('body > center:nth-child(1) > p:nth-child(3) > a > img')
              .wait(5000)
              .screenshot(`./lib/pictures/${date}.jpg`)
              .then(() => {
                console.log(`The picture for ${date} has been saved.`);
              })
              .catch(error => {
                console.error(error);
              });
          } else {
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
                console.log(
                  `The media for ${date} is an embedded video, not an image.`
                );
                return nightmare
                  .goto(result)
                  .wait(3000) // wait for the video to enter fullscreen mode
                  .screenshot(`./lib/pictures/${date}.jpg`)
                  .then(() => {
                    console.log(`The picture for ${date} has been saved.`);
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
    });
  }
  return nightmare.end(() => console.log('...done'));
}

vo(run)(err => console.error(err));

process.on('SIGINT', () => {
  console.log('Caught interrupt signal');
  process.exit(1);
});
