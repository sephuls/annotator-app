import pandas as pd


class DataStream:
    """Class for integrated data set."""

    def __init__(self, fps: int, source: str, start_frame: int = 0) -> object:
        self.fps = fps
        self.source = source
        self.start_frame = start_frame

        if source == 'MediaPipe':
            pass
        elif source == 'Live Link Face':
            pass
        else:
            return 0