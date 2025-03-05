import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_and_get_post():
    # Signup and login to obtain token
    client.post("/auth/signup", json={
        "username": "poster",
        "password": "secret",
        "city": "CityX"
    })
    login_response = client.post("/auth/login", data={
        "username": "poster",
        "password": "secret"
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a post
    post_data = {
        "title": "Test Product",
        "description": "A product for testing",
        "price": 100.0,
        "is_free": False,
        "exchange_items": "Item1,Item2",
        "allow_negotiation": True,
        "state": "published"
    }
    response = client.post("/posts", json=post_data, headers=headers)
    assert response.status_code == 200
    created_post = response.json()
    assert created_post["title"] == "Test Product"
    
    # Retrieve posts (should include the newly published post)
    response = client.get("/posts", headers=headers)
    assert response.status_code == 200
    posts = response.json()
    assert any(post["id"] == created_post["id"] for post in posts)
