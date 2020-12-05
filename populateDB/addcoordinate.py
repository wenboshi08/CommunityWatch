import pandas as pd
import requests
# from sqlalchemy import create_engine
#
# # connect to local sqllite Database
# engine = create_engine('sqlite:///../crimedb.db')
# conn = engine.connect()

# prepare dataframe to write to sql
crimes = pd.read_csv('Crime_Reports.csv')
# remove the crime record where Neighborhood is NaN
cleaned_crimes = crimes.dropna()

#convert Date of Report to ISO-8601 i.e.: YYYY-MM-DDTHH:MM:SS.SSS
cleaned_crimes['Date of Report'] = pd.to_datetime(cleaned_crimes['Date of Report']).apply(
        lambda x: x.strftime('%Y-%m-%dT%H:%M%:%SZ'))

# select needed columns and rename columns to match db_config.js
cleaned_crimes = cleaned_crimes[['File Number', 'Date of Report', 'Crime', 'Neighborhood', 'Location']]
cleaned_crimes.columns = ['fileNumber', 'reportDate', 'crimeType', 'neighborhoodName', 'location']
cleaned_crimes = cleaned_crimes.loc[cleaned_crimes['reportDate'] >= '2018']
print(cleaned_crimes.shape)
print(cleaned_crimes.head())

API_KEY = 'C7hf7bqv7uexG015Qz75uyy0WlDJitXG'
# set a default value for latitude and longitude
cleaned_crimes['latitude'] =42.373611
cleaned_crimes['longitude'] =-71.110558
for index, row in cleaned_crimes.iterrows():
        location = row['location']
        r = requests.get('http://www.mapquestapi.com/geocoding/v1/address?key=' + API_KEY + '&location=' + location)
        response = r.json()
        coordinate = response['results'][0]['locations'][0]['displayLatLng']
        cleaned_crimes.loc[index, 'latitude'] = coordinate['lat']
        cleaned_crimes.loc[index, 'longitude'] = coordinate['lng']
        if index%100 == 0:
                print(index)
cleaned_crimes.to_csv('crimes_coordinates.csv', index=False)
