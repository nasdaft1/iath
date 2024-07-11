import json
import os
from typing import Literal

from dotenv import load_dotenv
from pydantic import conint, BaseModel
from pydantic_settings import BaseSettings

load_dotenv()
# Корень проекта
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
BASE_DIR_SRC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR_JSON = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DEVELOPMENT = False
YOU_IP_DEVELOPMENT = '192.168.1.81'


class AppConfig(BaseSettings, BaseModel):
    # Название проекта. Используется в Swagger-документации
    project_name: str = 'movies'
    server_name: str = 'https://voice-t.ru'
    url_token: str = 'http://voice-t.ru/api/v1/auth/token'
    url_elastic_search: str = 'http://voice-t.ru/api/v1/search/film'

    delay_time_send: int = 500
    app_host: str = '127.0.0.1'
    app_port: conint(ge=1, le=65535) = 8080
    # настройки redis
    redis_host: str = '127.0.0.1'
    redis_port: conint(ge=1, le=65535) = 6379
    cache_expire_time: conint(ge=0) = 300  # в секундах
    # настройки elasticsearch
    elastic_host: str = 'http://127.0.0.1'
    elastic_port: conint(ge=1, le=65535) = 9200

    log_format: str = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    log_default_handlers: list[str] = ['console', 'file']
    log_level: Literal['DEBUG', 'ERROR', 'WARNING', 'CRITICAL', 'INFO', 'FATAL'] = 'DEBUG'
    log_file: str = 'test.log'

    class Config:
        env_file = f'{BASE_DIR_SRC}/.env'
        env_file_encoding = 'utf-8'
        extra = 'allow'


class Crypt(BaseSettings):
    admin_role_name: str = 'admin'
    token_name: list[str] = ['ac_token', 'rc_roken']  # имя токена доступа и токена refresh
    secret_key: str = 'secret_key'
    algorithm: str = 'HS256'
    token_live: list[int] = [30, 4000]  # минуты
    cookie_live: list[int] = [3600, 249200]  # секунды
    # Для паролей
    hashing_method: str = 'PBKDF2'
    hashing_salt_length: int = 16

    yandex_cloud_api: str = ''  # ключ бессрочный

    class Config:
        env_file = f'{BASE_DIR}/.env'
        env_file_encoding = 'utf-8'
        extra = 'allow'


class StorageConfig(BaseSettings):
    service_name: str = None
    endpoint_url: str
    aws_access_key_id: str
    aws_secret_access_key: str
    bucket_name: str
    region: str = None

    class Config:
        env_file = f'{BASE_DIR}.env'
        env_file_encoding = 'utf-8'
        extra = 'allow'


class ContextQuestion(BaseSettings):
    error_query: str = 'Incorrect query'
    find_rating: str = 'Search by rating'
    find_genre: str = 'Search by genre'
    find_person_rating: str = 'Search by rating and person'
    find_genre_rating: str = 'Search by rating and genre'
    find_person: str = 'Find by actors, screenwriters, directors'
    find_person_genre: str = 'Search by actors, screenwriters, directors and genre'
    find_film: str = 'Find a movie by words'


class ErrorMessage(BaseSettings):
    # Ответ при отсутвии данных
    no_film_found: str = 'film not found'
    no_genre_found: str = 'genre not found'
    no_genres_found: str = 'no genres found'
    no_person_found: str = 'person not found'
    no_films_with_person_found: str = 'films with person not found'


def config_lang():
    with open(f'{BASE_DIR_SRC}/config_lang.json', 'r') as f:
        result = json.load(f)
        return result


# security_config = Crypt()
# config = AppConfig()
# param_voice = config_lang()
# storage_config = StorageConfig()
# context_question = ContextQuestion()
# error_message = ErrorMessage()
