def get_dates(start, end):
    dates = []
    date = int(start)
    end = int(end)
    dates.append(start)

    days_in_month = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    while date < end:
        year = int(str(date)[0:2])
        day = int(str(date)[-2:])
        month = int(str(date)[2:4])

        if month < 9:
            # account for leap years
            if month == 2 and year % 4 == 0:
                if day < 29:
                    date += 1
                else:
                    date = int(str(year) + '0' + str(month + 1) + '01')
            elif day < days_in_month[month]:
                date += 1
            else:
                date = int(str(year) + '0' + str(month + 1) + '01')
            dates.append(str(date))

        elif 9 <= month < 12:
            if day < days_in_month[month]:
                date += 1
            else:
                date = int(str(year) + str(month + 1) + '01')
            dates.append(str(date))

        elif month == 12:
            if day < days_in_month[month]:
                date += 1
            else:
                date = int(str(year + 1) + '0101')
            dates.append(str(date))

    return dates


def main():
    start_date = ''
    end_date = ''
    dates = []
    with open('daterange.csv', 'r') as f:
        for line in f:
            try:
                start_date, end_date = line.strip().split(',')
            except ValueError:
                print('Error: Too many dates in the csv file.')

    with open('dates.csv', 'w') as f:
        dates = get_dates(start_date, end_date)
        for i, date in enumerate(dates):
            if i < len(dates) - 1:
                f.write(date + ',')
            else:
                f.write(date)


if __name__ == '__main__':
    main()
