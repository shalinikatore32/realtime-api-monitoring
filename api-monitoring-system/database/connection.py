# database/connection.py
import os
from pymongo import MongoClient
from config.settings import MONGO_URI, MONGO_DB_NAME

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[MONGO_DB_NAME]

def get_db():
    return db
