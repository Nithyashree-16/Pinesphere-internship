from flask import Blueprint, request, jsonify
from services.classify import classify_ticket
from services.summarize import summarize_ticket

ai_bp = Blueprint('ai', __name__)


# POST /api/ai/classify
@ai_bp.route('/classify', methods=['POST'])
def classify():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        description = data.get('description', '').strip()

        if not description or len(description) < 10:
            return jsonify({"error": "Description too short. Minimum 10 characters."}), 400

        result = classify_ticket(description)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# GET /api/ai/summarize/<ticket_id>
@ai_bp.route('/summarize/<ticket_id>', methods=['GET'])
def summarize(ticket_id):
    try:
        if not ticket_id:
            return jsonify({"error": "Ticket ID is required"}), 400

        result = summarize_ticket(ticket_id)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
