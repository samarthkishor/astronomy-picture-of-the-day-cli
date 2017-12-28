import json

print('Initializing explanations...')
explanations_data = {'elements': []}

with open('./lib/explanations/explanations.json', 'w') as outfile:
    json.dump(explanations_data, outfile)

print('...done')
