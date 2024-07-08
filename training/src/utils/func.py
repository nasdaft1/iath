class Incrementer:
    def __init__(self, start_id):
        # Инициализация начального значения
        self.value = start_id

    def increment(self):
        # Увеличение значения на 1
        self.value += 1
        return self.value


incrementer = Incrementer(20)
