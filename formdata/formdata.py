#_*_ coding: utf-8 _*_
from flask import Flask, jsonify
from flask import render_template, request

app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        document = request.files['document']
        return jsonify({'msg': 'ok',
                        'file': document.filename,
                       })
    else:
        return render_template('index.html')

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=8000)
