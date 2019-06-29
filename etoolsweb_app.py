from flask import Flask,render_template,request, make_response, send_file, jsonify
import pandas as pd
import numpy as np
import json,os
#from flask.ext.login import LoginManager,login_user ,UserMixin
#from werkzeug import secure_filename


app=Flask(__name__)

@app.route('/')
def home():
	return "Hello, check address!"

@app.route('/simdata', methods=['GET','POST'])
def simdata():
    return render_template("simdata.htm",simdata = 'testdata')

@app.route('/simdataapi',methods=['GET','POST'])
def simdataapi():
    return  jsonify(pd.read_csv('EUI.csv').iloc[:,:].replace(np.NAN,'nan').to_dict(orient = 'records'))

@app.route('/testdataapi')
def testdataapi():
    return jsonify({"about":"Hello World"})

@app.route('/binplot', methods=['GET','POST'])
def binplot():
	return render_template("vuebinplotdc.htm")

if __name__=='__main__':
	app.run(debug=True)
