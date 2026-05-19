from flask import Flask, jsonify
from flask_cors import CORS
from routes.ai_routes import ai_bp

app = Flask(__name__)

# Allow requests from Visrutha's frontend
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000"
        ]
    }
})

# Register AI routes under /api/ai
app.register_blueprint(ai_bp, url_prefix='/api/ai')


@app.route('/')
def home():
    return jsonify({
        "message": "AI Service is running!",
        "endpoints": {
            "classify":  "POST /api/ai/classify",
            "summarize": "GET  /api/ai/summarize/<ticket_id>"
        }
    })


if __name__ == '__main__':
    print("=" * 40)
    print("  AI Service starting on port 8000")
    print("  POST /api/ai/classify")
    print("  GET  /api/ai/summarize/<id>")
    print("=" * 40)
    app.run(port=8000, debug=True)
