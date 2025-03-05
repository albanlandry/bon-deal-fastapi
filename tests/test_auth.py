import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_signup_and_login():
    # Signup
    response = client.post("/auth/signup", json={
        "username": "testuser",
        "password": "testpass",
        "city": "TestCity"
    })
    assert response.status_code == 200

    # Login (using form data)
    response = client.post("/auth/login", data={
        "username": "testuser",
        "password": "testpass"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
