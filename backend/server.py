import random
import pandas as pd
from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
from config import Config
from models import User, Project, DataStream, VideoStream, db


app = Flask(__name__)
app.config.from_object(Config)

bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)



def get_current_user() -> User:
    """"""

    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    return User.query.filter_by(id=user_id).first()


@app.route('/@me', methods=['GET'])
def API_get_current_user() -> dict:
    """"""

    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.filter_by(id=user_id).first()

    return jsonify({
        'email': user.email,
        'id': user.id
    })


@app.route('/register', methods=['POST'])
def API_register_user() -> dict:
    """"""

    email = request.json['email']
    password = request.json['password']

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({'error': 'User with this email already exists'}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'email': new_user.email,
        'id': new_user.id
    })


@app.route('/login', methods=['POST'])
def API_login_user() -> dict:
    """"""

    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({'error': 'No user found with this email'}), 404

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Incorrect password'}), 401

    session['user_id'] = user.id

    return jsonify({
        'email': user.email,
        'id': user.id
    })


def populate_db() -> None:
    """Function to populate db with test data."""


@app.route("/project/<name>/add", methods=['POST'])
def create_new_project(name):
    """"""

    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.filter_by(id=user_id).first()

    new_project = Project(name=name)

    user.projects.append(new_project)
    db.session.commit()

    if user.projects:
        app.logger.debug('Projects found')
        return jsonify(user.projects)
    else:
        app.logger.debug('No projects found')
        return '', 204


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # db.drop_all()
        # populate_db()
    app.run(debug=True)
