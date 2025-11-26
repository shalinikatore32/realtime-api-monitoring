import os
from database import connection, logger

def test_db_connection():
    # This test requires a running MongoDB server or Atlas access
    db = connection.get_db()
    assert db is not None

def test_log_insert():
    # insert a log and ensure it returns a doc
    doc = logger.log_event("http://example.com", 200, 123, True, "OK")
    assert "url" in doc
