import multiprocessing
import os

bind = "0.0.0.0:10000"
workers = 1  # Fixed for low-RAM Render free tier
threads = 4
timeout = 120
worker_class = "gthread"

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
