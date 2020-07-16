"""
weatherDtata
Author: Shahil Hussain
Github: https://github.com/Shahilsky

 IMPORTANT:
 1.For safety purpose, only first 1000 cities are taken (check line 51 and 52),
   if you want list of all cities (beyond 20000), then comment line 52 and uncomment line 51, but remember it requires
   strong hardware.
 2.Visit www.openweathermap.org and generate your API_KEY there and add it in line 23.
"""

import json
import requests
from flask import Flask, render_template, jsonify, request

# instantiate the app
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SECRET_KEY"] = "qer23412kzxcvk213"

# please set your api key here
API_KEY = ""

# extract city details from the json file
# https://stackoverflow.com/questions/9233027/unicodedecodeerror-charmap-codec-cant-decode-byte-x-in-position-y-character
cities = None
with open('city.list.json', encoding='utf-8') as file:
    cities = json.load(file)


@app.route('/', methods=("GET", "POST"))
@app.route('/index', methods=("GET", "POST"))
def index():
    """This will load the main index page"""
    if request.method == "POST":
        cityID = request.form.get("cityID");
        if cityID == "" or not cityID:
            return "Please Enter City ID"

        response = requests.get('https://api.openweathermap.org/data/2.5/weather', {
            "id": cityID,
            "appid": API_KEY,
        })

        if response.status_code == 200:
            if response.json()["cod"] == 200:
                return jsonify(response.json())
            else:
                return "none"
        else:
            return "none"

    return render_template("index.html")


@app.route('/city/<int:row>', methods=("GET",))
def get_city(row):
    """This will provide the city in json format according to row number"""
    # if row > len(cities):
    if row > 1000:
        return "none"

    return jsonify({"cities": cities[row:row+20]})


@app.route('/weather/<int:city_id>', methods=("GET",))
def get_weather(city_id):
    """This will provide the weather of the city given by its id"""
    
    response = requests.get('https://api.openweathermap.org/data/2.5/weather', {
        "id": city_id,
        "appid": API_KEY,
    })
    
    if response.status_code == 200:
        if response.json()["cod"] == 200:
            return jsonify({"temp": response.json()["main"]["temp"]})
        else:
            return "none"
    else:
        return "none"


if __name__ == '__main__':
    # run the app 
    app.run(debug=True)
