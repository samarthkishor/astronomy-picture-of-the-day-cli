# Astronomy Picture of the Day CLI

A program that scrapes [NASA's Astronomy Picture of the Day website](https://apod.nasa.gov/apod/) and automatically creates a pdf with the picture and explanation.

## Installation
> Note: Make sure you have LaTeX, Node.js, and Python 3 installed before proceeding. The program was created and tested on a computer running macOS but it should also work on Linux. It uses Node for the web scraper and Python for creating and compiling the LaTeX file into a pdf.

First clone the repository and run

    npm install

and

    pip3 install -r requirements.txt

to install all the dependencies.

Finally, navigate to the `apod` directory and run

    python3 apod.py

to start the program.

If the program runs successfully, you can paste the following code into your `bashrc` to run the program from any directory by typing `apod` into the terminal:

```bash
    function apod() {
        if [ -e  PATH_TO_DIRECTORY/apod/apod.py ]; then
            cd PATH_TO_DIRECTORY/apod/ && python3 apod.py
        else
            echo "Something went wrong..."
        fi
    }
```

## Notes
- See the [PyLaTeX](https://jeltef.github.io/PyLaTeX/latest/index.html) and [Nightmare](https://github.com/segmentio/nightmare#api) documentation for additional information. This program wouldn't exist without these excellent projects.
- Sometimes the Astronomy Picture of the Day website will have an embedded video instead of a picture. If that is the case, the scraper will take a screenshot of the fullscreen video (usually either YouTube or Vimeo).
