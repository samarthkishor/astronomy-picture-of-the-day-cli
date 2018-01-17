import sys


def get_dates(start, end):
    '''Returns a list of yyyymmdd formatted dates from the start date to the end
    date'''
    dates = []
    date = int(start)
    end = int(end)
    dates.append(start)

    days_in_month = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    while date < end:
        year = int(str(date)[0:2])
        month = int(str(date)[2:4])
        day = int(str(date)[-2:])

        # Make sure dates between 1/1/2000 and 1/1/2010 are correct
        if len(str(date)) == 5:
            year = int(str(date)[0])
            month = int(str(date)[1:3])

        if month < 9:
            # Account for leap years
            if month == 2 and year % 4 == 0:
                if day < 29:
                    date += 1
                else:
                    date = int(str(year) + '0' + str(month + 1) + '01')
            elif day < days_in_month[month]:
                date += 1
            else:
                date = int(str(year) + '0' + str(month + 1) + '01')
            if year < 10:
                dates.append('0' + str(date))
            else:
                dates.append(str(date))

        elif 9 <= month < 12:
            if day < days_in_month[month]:
                date += 1
            else:
                date = int(str(year) + str(month + 1) + '01')

            if year < 10:
                dates.append('0' + str(date))
            else:
                dates.append(str(date))

        elif month == 12:
            if day < days_in_month[month]:
                date += 1
            else:
                date = int(str(year + 1) + '0101')

            if year < 10:
                dates.append('0' + str(date))
            else:
                dates.append(str(date))

    return dates


def main():
    start_date = ''
    end_date = ''
    dates = []

    print('Building dates.csv...')

    with open('./temp/dates/daterange.csv', 'r') as f:
        for line in f:
            try:
                start_date, end_date = line.strip().split(',')
            except ValueError:
                print('Error: Too many dates in daterange.csv')

    with open('./temp/dates/dates.csv', 'w') as f:
        dates = get_dates(start_date, end_date)
        for i, date in enumerate(dates):
            if i < len(dates) - 1:
                f.write(date + ',')
            else:
                f.write(date)

    print('...done')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(1)
