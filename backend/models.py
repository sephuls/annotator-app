from uuid import uuid4
from datetime import datetime, timedelta
from dataclasses import dataclass
from flask_sqlalchemy import SQLAlchemy


TC_FORMAT = "%H:%M:%S:%f"

db = SQLAlchemy()


def get_uuid():
    return uuid4().hex


@dataclass
class VideoStream(db.Model):
    """
    Class for integrated video data.
    """

    __tablename__ = 'video_stream'

    id: int = db.Column('id', db.Integer, primary_key=True)
    file_path: str = db.Column(db.String(100), nullable=False)
    fps: float = db.Column(db.Float, nullable=True)
    mirrored: bool = db.Column(db.Boolean, nullable=True)
    data_stream_id: str = db.Column(db.Integer, db.ForeignKey('data_stream.id'))


# @dataclass
# class MoCapStream:
#     """
#     Class for integrated motion capture data.
#     """

#     id: int
#     fps: float
#     file_path: str
#     num_frames: int


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
    num_frames: int = db.Column(db.Integer, nullable=True)

    video_stream = db.relationship('VideoStream', backref='data_stream', uselist=False)
    # mo_cap_stream: MoCapStream = None


@dataclass
class Project(db.Model):
    """"""

    __tablename__ = 'project'

    id: int  = db.Column('id', db.Integer, primary_key=True)
    name: str = db.Column(db.String(100), nullable=False)
    start_index: int = db.Column(db.Integer, nullable=True)
    user_id: str = db.Column(db.String, db.ForeignKey('user.id'))
    data_streams: list = db.relationship('DataStream', backref='project')


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