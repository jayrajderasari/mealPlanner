from flask import Flask, request, redirect, render_template
import random, json
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


data = {
    'southIndian': [['Dosa', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnKX5f_qUT4c-LgQ0ElywavoKMWPxyHcUqJA&usqp=CAU'],
                    ['Idli', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx0-KthRy1thy1LXZmmD59JTTUnou9mmvjQw&usqp=CAU'], 
                    ['Medu Wada', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa176Oi0JdD8swTqvfkbZLNtQ1-Yn1yOs4XA&usqp=CAU'],
                    ['Upma', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsSE5T7QDt07pFaxgRkgfPVXg7sYJtguyIog&usqp=CAU']
                    ],
    'northIndian': [['Panner', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBgc6jNnQgRH0ql3etygKkWtpddQSLsDuAQ&usqp=CAU'],
                    ['Aloo', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8rKoxZdsneyodyJZGTB6zYus-ZEVPBXVYGw&usqp=CAU'],
                    ['Dal', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnOjZ_3Zdgar550bswU5dbFRVGb74Fuy1J8g&usqp=CAU'],
                    ['Kofta', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpJs8plAp5OZA3BxucaY8JEoC-HNJW_fXREg&usqp=CAU']]
}


@app.route('/')
@cross_origin()
def menu():
    cuisine = request.args.get('cuisine')
    item = random.choice(data[cuisine])
    itemJSon = json.dumps(item)
    return (itemJSon)

if __name__=='__main__':
    app.run(debug=True)