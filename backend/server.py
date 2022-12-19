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
def API_add_new_project(name):
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


# def sync_data_stream():
#     def sync(self) -> Tuple[int, datetime, int, int]:
#         """
#         Function for configuring meta data for a VideoStream object.
#         Makes use of meta data extracted from the video file
#         using the ffmpeg library. When no timecode is found in the meta data
#         it tries to detect a QR code in the set of frames.

#         Tries to set the following variables:
#             - fps

#         It returns the following variables to set the parent DataStream object:
#             - num_frames
#             - start_timecode
#             - start_index
#             - end_index
#         """

#         # Meta data about the video file are extracted.
#         meta_data = ffmpeg.probe(self.file_path)["streams"][0]
#         self.fps = utils.fraction_str_to_float(meta_data['r_frame_rate'])
#         num_frames = int(meta_data['nb_frames'])

#         # Try to set timecode for start of recording from either meta data or detected QR.
#         if 'timecode' not in meta_data['tags']:
#             frame_nr, found_timecode = utils.get_timecode(self.file_path, mirrored=self.mirrored)

#             if frame_nr is None and found_timecode is None:
#                 print("ERROR: Could not configure VideoStream data from file")
#                 return None, None, None

#             start_timecode = found_timecode - timedelta(seconds=(frame_nr * (1 / self.fps)))

#         else:
#             start_timecode = datetime.strptime(meta_data['tags']['timecode'], TC_FORMAT)

#         start_index = utils.timecode_to_index(start_timecode)
#         end_index = int( start_index + (num_frames * (60 / self.fps)) )

#         return num_frames, start_timecode, start_index, end_index


@app.route("/project/<project_id>/<data_stream_id>/add_video_stream", methods=['POST'])
def API_add_video_stream(project_id, data_stream_id):
    """"""

    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    project = Project.query.get(project_id)

    if project is None:
        return jsonify({'error': 'Project not found'}), 404

    data_stream = DataStream.query.get(data_stream_id)

    if data_stream is None:
        return jsonify({'error': 'DataStream not found'}), 404


    video_file_path = request.json['video_file_path']
    video_stream = VideoStream(file_path=video_file_path)

    data_stream.video_stream = video_stream

    return jsonify(data_stream.video_stream), 200


@app.route("/project/<project_id>/add_data_stream", methods=['POST'])
def API_add_data_stream(project_id):
    """"""

    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    project = Project.query.get(project_id)

    if project is None:
        return jsonify({'error': 'Project not found'}), 404

    data_stream = DataStream(name="default")
    project.data_streams.append(data_stream)
    db.session.commit()

    return jsonify(project.data_streams), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # db.drop_all()
        # populate_db()
    app.run(debug=True)
