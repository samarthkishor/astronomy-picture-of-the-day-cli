import sys
import os
import json


def main():
    print('Initializing explanations...')
    explanations_data = {'elements': []}

    if not os.path.isdir('./temp/explanations'):
        os.mkdir('./temp/explanations')

    with open('./temp/explanations/explanations.json', 'w') as outfile:
        json.dump(explanations_data, outfile)

    print('...done')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(1)
