import cv2
import ffmpeg
from typing import Tuple
from datetime import datetime, timedelta


TC_FORMAT = "%H:%M:%S:%f"


def timecode_to_index(timecode: datetime, microseconds: bool = False) -> int:
    """"""

    if microseconds:
        frame_number = int(timecode.microsecond * 6 / 100000)
    else:
        frame_number = int(timecode.microsecond / 10000)

    return (timecode.hour * 216000
            + timecode.minute * 3600
            + timecode.second * 60
            + frame_number)


def get_timecode_QR(media_file: str, mirrored: bool = False) -> Tuple[int, datetime]:
    """"""

    frame_nr = 0
    value = ''

    cap = cv2.VideoCapture(media_file)

    while(cap.isOpened() and value == '' and frame_nr < 100):
        _, frame = cap.read()

        if mirrored:
            # Converting the input frame to grayscale
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Fliping the image as said in question
            frame = cv2.flip(frame,1)

        try:
            detect = cv2.QRCodeDetector()
            value, _, _ = detect.detectAndDecode(frame)
        except:
            pass

        frame_nr += 1

    cap.release()
    cv2.destroyAllWindows()

    if value != '':
        return frame_nr, datetime.strptime(value, "oT%y%m%d%H%M%S.%f")

    return None, None


def set_meta_data(data_stream):
    """"""

    video_stream = data_stream.video_stream

    # Meta data about the video file are extracted.
    meta_data = ffmpeg.probe(video_stream.file_path)["streams"][0]
    video_stream.fps = fraction_str_to_float(meta_data['r_frame_rate'])
    video_stream.num_frames = int(meta_data['nb_frames'])

    # Try to set timecode for start of recording from either meta data or detected QR.
    if 'timecode' not in meta_data['tags']:
        frame_nr, found_timecode = get_timecode_QR(video_stream.file_path, mirrored=video_stream.mirrored)

        if frame_nr is None and found_timecode is None:
            print("ERROR: Could not configure VideoStream data from file")
            return False

        data_stream.start_timecode = found_timecode - timedelta(seconds=(frame_nr * (1 / video_stream.fps)))

    else:
        data_stream.start_timecode = datetime.strptime(meta_data['tags']['timecode'], TC_FORMAT)

    data_stream.start_index = timecode_to_index(data_stream.start_timecode)
    data_stream.end_index = int(data_stream.start_index + (video_stream.num_frames * (60 / video_stream.fps)))

    return True


def fraction_str_to_float(fraction: str) -> float:
    components = fraction.split('/')
    return int(components[0]) / int(components[1])
