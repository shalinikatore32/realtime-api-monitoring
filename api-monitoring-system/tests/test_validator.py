from core.validator import validate_response
from types import SimpleNamespace
import datetime

class DummyResp:
    def __init__(self, status_code=200, elapsed_ms=100, json_data=None):
        self.status_code = status_code
        self._elapsed = elapsed_ms
        self._json_data = json_data

    @property
    def elapsed(self):
        return datetime.timedelta(milliseconds=self._elapsed)

    def json(self):
        if self._json_data is None:
            raise ValueError("No JSON")
        return self._json_data

def test_ok():
    r = DummyResp(status_code=200, elapsed_ms=100, json_data={"bitcoin":{"usd":50000}})
    ok, msg, rt = validate_response(r)
    assert ok
    assert msg == "OK"

def test_bad_status():
    r = DummyResp(status_code=500, elapsed_ms=100, json_data={"a":1})
    ok, msg, rt = validate_response(r)
    assert not ok
    assert "Unexpected status code" in msg

def test_invalid_json():
    r = DummyResp(status_code=200, elapsed_ms=100, json_data=None)
    ok, msg, rt = validate_response(r)
    assert not ok
    assert "Invalid JSON" in msg
