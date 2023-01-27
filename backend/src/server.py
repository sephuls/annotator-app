import utils
import json
import os
from os.path import join
import pandas as pd
from flask import Flask, request, jsonify, session, Response, send_file
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
from config import Config
from werkzeug.utils import secure_filename
from models import User, Project, DataStream, VideoStream, MoCapStream, AnnotationStream, Annotation, db


app = Flask(__name__, static_folder="static")
app.config.from_object(Config)
bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)



#######################################################################################################



@app.route('/@me', methods=['GET'])
def API_get_current_user() -> dict:
    """
    Server-side function for reading the current user
    using the user_id set as a session token.
    """

    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.filter_by(id=user_id).first()

    return jsonify({
        'email': user.email,
        'id': user.id
    }), 200


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
    }), 200


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
    }), 200



#######################################################################################################



@app.route("/projects", methods=['POST'])
def API_create_project():
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    user = User.query.filter_by(id=user_id).first()

    name = request.json['name']
    new_project = Project(name=name)
    user.projects.append(new_project)
    db.session.commit()

    if user.projects:
        app.logger.debug('Projects found')
        return jsonify(user.projects)

    app.logger.debug('No projects found')
    return '', 204


@app.route('/projects', methods=['GET'])
def API_get_projects():
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    user = User.query.filter_by(id=user_id).first()

    if user.projects:
        return jsonify(user.projects)

    return '', 204


@app.route('/project/<project_id>', methods=['GET'])
def API_get_project(project_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    user = User.query.filter_by(id=user_id).first()
    project = Project.query.get(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404
    if project not in user.projects:
        return jsonify({'error': 'Unauthorized'}), 401

    return jsonify(project), 200


@app.route('/project/<project_id>', methods=['DELETE'])
def API_delete_project(project_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    user = User.query.filter_by(id=user_id).first()
    project = Project.query.get(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404
    if project not in user.projects:
        return jsonify({'error': 'Unauthorized'}), 401

    db.session.delete(project)
    db.session.commit()

    return jsonify(user.projects), 200



#######################################################################################################



@app.route("/video_streams/<project_id>/<data_stream_id>", methods=['POST'])
def API_create_video_stream(project_id, data_stream_id):
    """
    Function that serves as the API endpoint for creating a VideoStream object
    and storing it in the apps database.
    """

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    project = Project.query.get(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404
    data_stream = DataStream.query.get(data_stream_id)
    if data_stream is None:
        return jsonify({'error': 'DataStream not found'}), 404

    file = request.files['file']

    if not file or not utils.allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    file_path = join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
    file.save(file_path)


    # If video file is of MOV format we have to convert it to MP4 format.
    if file.filename.rsplit('.', 1)[1].lower() == 'mov':
        file_path_mp4 = file_path.rsplit('.', 1)[0] + '.mp4'
        os.system(f"ffmpeg -i {file_path} -vcodec h264 -acodec mp2 {file_path_mp4}")
        os.remove(file_path)
        file_path = file_path_mp4

    video_stream = VideoStream(file_path=file_path, mirrored=False)
    data_stream.video_stream = video_stream

    db.session.commit()

    return jsonify(data_stream.video_stream), 200


@app.route("/video_streams/<project_id>/<data_stream_id>", methods=['GET'])
def API_get_video_stream(project_id, data_stream_id):
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
    if data_stream.video_stream is None:
        return jsonify({'error': 'VideoStream not found'}), 404

    return jsonify(data_stream.video_stream), 200


@app.route("/video_streams/<data_stream_id>", methods=['DELETE'])
def API_delete_video_stream(data_stream_id):
    """
    Function that serves as the API endpoint for deleting a VideoStream
    from the apps database. The original video file is also deleted
    from object storage.
    """

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    data_stream = DataStream.query.get(data_stream_id)
    if data_stream is None:
        return jsonify({'error': 'DataStream not found'}), 404
    if data_stream.video_stream is None:
        return jsonify({'error': 'VideoStream not found'}), 404

    # Undo synchronisation of data stream.
    data_stream.start_timecode = None
    data_stream.start_index = 0
    data_stream.end_index = 0

    os.remove(data_stream.video_stream.file_path)
    db.session.delete(data_stream.video_stream)
    db.session.commit()

    return jsonify(data_stream), 200


#######################################################################################################


@app.route("/mocap_streams/<project_id>/<data_stream_id>", methods=['POST'])
def API_create_mocap_stream(project_id, data_stream_id):
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
    file = request.files['file']
    if not file or not utils.allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    file_path = join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
    file.save(file_path)
    source = request.form['source']
    mocap_stream = MoCapStream(file_path=file_path, source=source)
    data_stream.mocap_stream = mocap_stream
    db.session.commit()

    return jsonify(data_stream.mocap_stream), 200


@app.route("/mocap_streams/<data_stream_id>", methods=['DELETE'])
def API_delete_mocap_stream(data_stream_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    data_stream = DataStream.query.get(data_stream_id)
    if data_stream is None:
        return jsonify({'error': 'DataStream not found'}), 404
    mocap_stream = data_stream.mocap_stream
    if mocap_stream is None:
        return jsonify({'error': 'MoCapStream not found'}), 404

    db.session.delete(mocap_stream)
    db.session.commit()

    return jsonify(data_stream), 200



#######################################################################################################



@app.route("/data_streams/<project_id>/<data_stream_id>/sync", methods=['PATCH'])
def API_sync_data_stream(project_id, data_stream_id):
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

    succes = utils.set_meta_data(data_stream)
    if not succes:
        return jsonify({'error': 'Error while attempting to synchronise data stream'}), 500

    if project.start_index is None or data_stream.start_index < project.start_index:
        project.start_index = data_stream.start_index

    if project.end_index is None or data_stream.end_index > project.end_index:
        project.end_index = data_stream.end_index

    db.session.commit()

    return jsonify(project.data_streams), 200


@app.route("/data_streams/<project_id>", methods=['POST'])
def API_create_data_stream(project_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    project = Project.query.get(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404

    data_stream = DataStream(name="myDataStream")
    project.data_streams.append(data_stream)
    db.session.commit()

    return jsonify(project.data_streams), 200


@app.route("/data_streams/<data_stream_id>", methods=['DELETE'])
def API_delete_data_stream(data_stream_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    data_stream = DataStream.query.get(data_stream_id)
    if data_stream is None:
        return jsonify({'error': 'DataStream not found'}), 404

    db.session.delete(data_stream)
    db.session.commit()

    return jsonify({}), 200


@app.route('/data_streams/<project_id>', methods=['GET'])
def API_get_data_streams(project_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.filter_by(id=user_id).first()
    project = Project.query.get(project_id)

    # if project not in user.projects:
    #     return jsonify({'error': 'Unauthorized'}), 401

    if project is None:
        return jsonify({'error': 'Project not found'}), 404

    return jsonify(project.data_streams), 200



#######################################################################################################



@app.route("/annotation_streams/<project_id>", methods=['POST'])
def API_create_annotation_stream(project_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    project = Project.query.get(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404

    annotation_stream = AnnotationStream(name=request.json['name'])
    project.annotation_streams.append(annotation_stream)
    db.session.commit()

    return jsonify(project.annotation_streams), 200


@app.route("/annotation_streams/<project_id>", methods=['GET'])
def API_get_annotation_streams(project_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    project = Project.query.get(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404

    return jsonify(project.annotation_streams), 200


@app.route("/annotation_streams/<annotation_stream_id>", methods=['DELETE'])
def API_delete_annotation_streams(annotation_stream_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    annotation_stream = AnnotationStream.query.get(annotation_stream_id)
    if annotation_stream is None:
        return jsonify({'error': 'AnnotationStream not found'}), 404

    db.session.delete(annotation_stream)
    db.session.commit()

    return jsonify(annotation_stream), 200



#######################################################################################################


@app.route("/annotations/<project_id>/<annotation_stream_id>", methods=['POST'])
def API_create_annotation(project_id, annotation_stream_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    project = Project.query.get(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404
    annotation_stream = AnnotationStream.query.get(annotation_stream_id)
    if annotation_stream is None:
        return jsonify({'error': 'AnnotationStream not found'}), 404

    annotation = Annotation(
        label=request.json['label'],
        start_index=request.json['start_index'],
        end_index=request.json['end_index']
    )
    annotation_stream.annotations.append(annotation)
    db.session.commit()

    return jsonify(annotation_stream.annotations), 200


@app.route("/annotations/<project_id>/<annotation_stream_id>", methods=['GET'])
def API_get_annotations(project_id, annotation_stream_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    project = Project.query.get(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404
    annotation_stream = AnnotationStream.query.get(annotation_stream_id)
    if annotation_stream is None:
        return jsonify({'error': 'AnnotationStream not found'}), 404

    return jsonify(annotation_stream.annotations), 200


@app.route("/annotations/<project_id>/<annotation_stream_id>/<annotation_id>", methods=['DELETE'])
def API_delete_annotation(project_id, annotation_stream_id, annotation_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    project = Project.query.get(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404
    annotation_stream = AnnotationStream.query.get(annotation_stream_id)
    if annotation_stream is None:
        return jsonify({'error': 'AnnotationStream not found'}), 404
    if annotation_stream not in project.annotation_streams:
        return jsonify({'error': 'Unauthorized'}), 401
    annotation = Annotation.query.get(annotation_id)
    if annotation is None:
        return jsonify({'error': 'Annotation not found'}), 404

    db.session.delete(annotation)
    db.session.commit()

    return jsonify(annotation_stream.annotations), 200



#######################################################################################################


def in_stream_range(anno_start, anno_end, data_start, data_end):
    """"""

    return (anno_start > data_start and anno_end < data_end)


def mocap_data_to_df(data_stream):
    df = pd.read_csv(data_stream.mocap_stream.file_path)
    df.index += data_stream.start_index

    # TODO: fps
    return df


@app.route("/export/<project_id>", methods=['GET'])
def API_export_data(project_id):
    """"""

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    project = Project.query.get(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404
    if project.annotation_streams == []:
        return jsonify({'error': 'No annotations found'}), 404

    data = jsonify(project).get_json()
    mocap_streams = [{'name': ds.name, 'mocap_data': mocap_data_to_df(ds)} for ds in project.data_streams if ds.mocap_stream is not None]

    non_empty_annotation_streams = [an_str for an_str in data['annotation_streams'] if len(an_str['annotations']) > 0]

    annotations_df = pd.DataFrame.from_records(non_empty_annotation_streams).explode(column='annotations')
    annotations_df = pd.concat([annotations_df, annotations_df['annotations'].apply(pd.Series)], axis=1).drop(columns=['annotations'])

    export = {'project_name': project.name, 'annotations': []}

    for _, annotation in annotations_df.iterrows():
        annotation_set = annotation.to_dict()
        annotation_set['mocap_streams'] = []

        for mo_str in mocap_streams:
            annotation_set['mocap_streams'].append({
                'name': mo_str['name'],
                'mocap_data': mo_str['mocap_data'].loc[int(annotation.start_index):int(annotation.end_index)].to_dict(orient='records')
            })

        export['annotations'].append(annotation_set)

    path = app.config['UPLOAD_FOLDER'] + '/export.json'

    with open(path, 'w') as fp:
        json.dump(export, fp)

    return send_file(path, as_attachment=True)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)
