from pylatex import Document, Section, StandAloneGraphic, NewPage
from pylatex.utils import bold
import json

dataPath = '../lib/explanations/explanations.json'

with open(dataPath) as f:
    data = json.load(f)


def fill_document():
    doc = Document()
    for element in data['elements']:
        date = element['date']
        explanation = element['explanation']
        picture_path = '.' + element['picture']

        if date[2:4] == '01':
            month = 'January'
        elif date[2:4] == '02':
            month = 'February'
        elif date[2:4] == '03':
            month = 'March'
        elif date[2:4] == '04':
            month = 'April'
        elif date[2:4] == '05':
            month = 'May'
        elif date[2:4] == '06':
            month = 'June'
        elif date[2:4] == '07':
            month = 'July'
        elif date[2:4] == '08':
            month = 'August'
        elif date[2:4] == '09':
            month = 'September'
        elif date[2:4] == '10':
            month = 'October'
        elif date[2:4] == '11':
            month = 'November'
        elif date[2:4] == '12':
            month = 'December'
        else:
            month = 'Error: Invalid month'

        if int(date[4:]) < 10:
            day = date[-1]
        else:
            day = date[4:]

        if int(date[0:2]) < 95:
            year = '20' + date[0:2]
        else:
            year = '19' + date[0:2]

        with doc.create(
                Section(month + ' ' + day + ', ' + year, numbering=False)):
            doc.append(
                StandAloneGraphic(
                    image_options=r'width=\textwidth', filename=picture_path))
            doc.append(bold('\n\nExplanation:\n'))
            doc.append(explanation)
            doc.append(NewPage())

    doc.generate_pdf('astronomy-picture-of-the-day', clean_tex=False)


def main():
    print('Generating pdf...')
    fill_document()
    print('...done')


if __name__ == '__main__':
    main()
