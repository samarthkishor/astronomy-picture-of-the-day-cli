#!/usr/bin python3

import os
import sys
import subprocess
from Naked.toolshed.shell import execute_js
import build_dates
import initialize_explanations
import build_pdf


def main():
    if not os.path.isdir('./temp/dates'):
        os.mkdir('./temp/dates')
    if not os.path.isdir('./temp/pictures'):
        os.mkdir('./temp/pictures')

    get_dates = execute_js('get_dates.js')

    if get_dates:
        build_dates.main()
        initialize_explanations.main()

        get_apods = execute_js('get_apods.js')

        if get_apods:
            build_pdf.main()
            subprocess.call(
                ['open', '-a', 'Preview', 'astronomy-picture-of-the-day.pdf'])
        else:
            print('Error: get_apods.js has not executed')

    else:
        print('Error: get_dates.js has not executed')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(1)
