class AudioBuffer:
    def __init__(self, window_size, stride):
        self.window_size = window_size
        self.stride = stride
        self.buffer = []

    def add(self, chunk):
        self.buffer.extend(chunk)

        if len(self.buffer) >= self.window_size:
            window = self.buffer[-self.window_size:]
            self.buffer = self.buffer[-self.stride:]
            return window

        return None
