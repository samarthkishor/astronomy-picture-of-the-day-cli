#!usr/bin/python

import json


def main():
    print('Initializing explanations...')
    explanations_data = {'elements': []}

    with open('./lib/explanations/explanations.json', 'w') as outfile:
        json.dump(explanations_data, outfile)

    print('...done')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(1)
