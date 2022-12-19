import cv2
from typing import Tuple
from datetime import datetime


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


def fraction_str_to_float(fraction: str) -> float:
    components = fraction.split('/')
    return int(components[0]) / int(components[1])
