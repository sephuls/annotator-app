from uuid import uuid4
from datetime import datetime
from dataclasses import dataclass
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


def get_uuid():
    return uuid4().hex


@dataclass
class Annotation(db.Model):
    """
    Class for an annotation object.
    """

    __tablename__ = 'annotation'

    id: int = db.Column('id', db.Integer, primary_key=True)
    label: str = db.Column(db.String(100), nullable=False)
    start_index: int = db.Column(db.Integer, nullable=False)
    end_index: int = db.Column(db.Integer, nullable=False)
    annotation_stream_id: str = db.Column(db.Integer, db.ForeignKey('annotation_stream.id'))


@dataclass
class AnnotationStream(db.Model):
    """
    Class for collection of annotations.
    """

    __tablename__ = 'annotation_stream'

    id: int = db.Column('id', db.Integer, primary_key=True)
    project_id: str = db.Column(db.Integer, db.ForeignKey('project.id'))
    name: str = db.Column(db.String(100), nullable=True)
    annotations: list = db.relationship('Annotation', backref='annotation_stream.id')


@dataclass
class VideoStream(db.Model):
    """
    Class for integrated video data.
    """

    __tablename__ = 'video_stream'

    id: int = db.Column('id', db.Integer, primary_key=True)
    fps: float = db.Column(db.Float, nullable=True)
    num_frames: int = db.Column(db.Integer, nullable=True)
    mirrored: bool = db.Column(db.Boolean, nullable=False)
    file_path: str = db.Column(db.String(100), nullable=False)
    data_stream_id: str = db.Column(db.Integer, db.ForeignKey('data_stream.id'))



@dataclass
class MoCapStream(db.Model):
    """
    Class for integrated motion capture data object.
    """

    __tablename__ = 'mocap_stream'

    id: int = db.Column('id', db.Integer, primary_key=True)
    file_path: str = db.Column(db.String(100), nullable=False)
    fps: float = db.Column(db.Float, nullable=True)
    num_frames: int = db.Column(db.Integer, nullable=True)
    source: str = db.Column(db.String(100), nullable=False)
    data_stream_id: str = db.Column(db.Integer, db.ForeignKey('data_stream.id'))


@dataclass
class DataStream(db.Model):
    """
    Class for integrated streamable data object.
    """

    __tablename__ = 'data_stream'

    id: int = db.Column('id', db.Integer, primary_key=True)
    name: str = db.Column(db.String(100), nullable=True)
    project_id: str = db.Column(db.Integer, db.ForeignKey('project.id'))

    start_timecode: datetime = db.Column(db.DateTime, nullable=True)
    start_index: int = db.Column(db.Integer, nullable=True)
    end_index: int = db.Column(db.Integer, nullable=True)

    video_stream: VideoStream = db.relationship('VideoStream', uselist=False, backref='data_stream')
    mocap_stream: MoCapStream = db.relationship('MoCapStream', uselist=False, backref='data_stream')


@dataclass
class Project(db.Model):
    """"""

    __tablename__ = 'project'

    id: int  = db.Column('id', db.Integer, primary_key=True)
    name: str = db.Column(db.String(100), nullable=False)
    start_index: int = db.Column(db.Integer, nullable=True)
    end_index: int = db.Column(db.Integer, nullable=True)
    user_id: str = db.Column(db.String, db.ForeignKey('user.id'))
    data_streams: list = db.relationship('DataStream', backref='project')
    annotation_streams: list = db.relationship('AnnotationStream', backref='project')


@dataclass
class User(db.Model):
    """"""

    __tablename__ = 'user'

    id: str = db.Column(
        'id',
        db.String(32),
        primary_key=True,
        default=get_uuid
    )
    email: str = db.Column(db.String(320), nullable=False)
    password: str = db.Column(db.Text, nullable=False)
    projects: object = db.relationship('Project', backref='user')