import random
import pandas as pd
from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
from config import Config
from models import Project, DataStream, VideoStream, db


app = Flask(__name__)
app.config.from_object(Config)

bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)



def populate_db():
    """Function to populate db with test data."""


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # db.drop_all()
        # populate_db()
    app.run(debug=True)
