import ffmpeg
from typing import Tuple
from backend import utils
from uuid import uuid4
from datetime import datetime, timedelta
from dataclasses import dataclass
from flask_sqlalchemy import SQLAlchemy


TC_FORMAT = "%H:%M:%S:%f"

db = SQLAlchemy()


def get_uuid():
    return uuid4().hex


@dataclass
class VideoStream:
    """
    Class for integrated video data.
    """

    id: int
    file_path: str
    fps: float = 0
    mirrored: bool = False

    def sync(self) -> Tuple[int, datetime, int, int]:
        """
        Function for configuring meta data for a VideoStream object.
        Makes use of meta data extracted from the video file
        using the ffmpeg library. When no timecode is found in the meta data
        it tries to detect a QR code in the set of frames.

        Tries to set the following variables:
            - fps

        It returns the following variables to set the parent DataStream object:
            - num_frames
            - start_timecode
            - start_index
            - end_index
        """

        # Meta data about the video file are extracted.
        meta_data = ffmpeg.probe(self.file_path)["streams"][0]
        self.fps = utils.fraction_str_to_float(meta_data['r_frame_rate'])
        num_frames = int(meta_data['nb_frames'])

        # Try to set timecode for start of recording from either meta data or detected QR.
        if 'timecode' not in meta_data['tags']:
            frame_nr, found_timecode = utils.get_timecode(self.file_path, mirrored=self.mirrored)

            if frame_nr is None and found_timecode is None:
                print("ERROR: Could not configure VideoStream data from file")
                return None, None, None

            start_timecode = found_timecode - timedelta(seconds=(frame_nr * (1 / self.fps)))

        else:
            start_timecode = datetime.strptime(meta_data['tags']['timecode'], TC_FORMAT)

        start_index = utils.timecode_to_index(start_timecode)
        end_index = int( start_index + (num_frames * (60 / self.fps)) )

        return num_frames, start_timecode, start_index, end_index


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
class DataStream:
    """
    Class for integrated streamable data set.
    """

    id: int = 0
    name: str = ""
    start_timecode: datetime = None
    start_index: int = 0
    end_index: int = 0
    num_frames: int = 0
    video_stream: VideoStream = None
    # mo_cap_stream: MoCapStream = None

    def add_video_stream(self, file_path: str, sync: bool = False) -> None:
        """"""

        self.video_stream = VideoStream(0, file_path)

        if sync:
            self.num_frames, self.start_timecode, self.start_index, self.end_index = self.video_stream.sync()

        if self.start_timecode is None:
            # Do something because sync failed.
            return

    # def add_mo_cap_stream(self, mo_cap_stream: MoCapStream) -> None:
    #     self.mo_cap_stream = mo_cap_stream


@dataclass
class Project:
    """"""

    id: int = 0
    name: str = ""
    start_index = 0
    data_streams = []

    def add_data_stream(self, video_file_path: str, mo_cap_file_path: str = None) -> None:
        """"""

        data_stream = DataStream()
        data_stream.add_video_stream(video_file_path, sync=True)

        if data_stream.start_index < self.start_index:
            self.start_index = data_stream.start_index

        self.data_streams += [data_stream]


@dataclass
class User(db.Model):
    __tablename__ = 'user'

    id: str = db.Column(
        'id',
        db.String(32),
        primary_key=True,
        default=get_uuid
    )
    email: str = db.Column(db.String(320), nullable=False)
    password: str = db.Column(db.Text, nullable=False)