from core.config import config

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': config.log_format
        },
        'default': {
            '()': 'uvicorn.logging.DefaultFormatter',
            'fmt': '%(levelprefix)s %(message)s',
            'use_colors': None,
        },
        'access': {
            '()': 'uvicorn.logging.AccessFormatter',
            'fmt': "%(levelprefix)s %(client_addr)s - "
                   "'%(request_line)s' %(status_code)s",
        },
    },
    'handlers': {
        'console': {
            'level': config.log_level,
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'default': {
            'formatter': 'default',
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout',
        },
        'access': {
            'formatter': 'access',
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': config.log_file,
            'mode': 'w',
            'level': config.log_level,
            'encoding': "utf-8",
            'formatter': 'verbose'
        },
    },
    'loggers': {
        '': {
            'handlers': config.log_default_handlers,
            'level': config.log_level,
            'formatter': 'verbose',
        },
        'uvicorn.error': {
        },
        'uvicorn.access': {
            'handlers': ['access', 'file'],
            'propagate': False,
        },
    },
    'root': {
        'level': config.log_level,
        'formatter': 'verbose',
        'handlers': config.log_default_handlers,
    },
}
