import multiprocessing
import os

bind = "0.0.0.0:10000"
workers = multiprocessing.cpu_count() * 2 + 1
threads = 2
timeout = 120
worker_class = "gthread"

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
