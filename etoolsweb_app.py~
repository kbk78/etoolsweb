from flask import Flask,render_template,request, make_response, send_file
#from flask.ext.login import LoginManager,login_user ,UserMixin
#from werkzeug import secure_filename
import os


app=Flask(__name__)

@app.route('/')
def home():
	return "Hello, check address!"


@app.route('/binplot', methods=['GET','POST'])
def bindata():
	return render_template("binplot.html")


if __name__=='__main__':
	app.run(debug=True)
