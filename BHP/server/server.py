from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

@app.route('/get_location_names')
def get_location_names():
    locations = util.get_location_names()
    print("Fetched locations:", locations)  # Debug print
    if locations is None:
        print("Loading artifacts since locations is None")
        util.load_saved_artifacts()
        locations = util.get_location_names()
    response = jsonify({'locations': locations})
    return response

@app.route('/predict_home_price', methods=['POST', 'OPTIONS'])
def predict_home_price():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'})

    try:
        data = request.get_json()
        print("Received request data:", data)
        
        total_sqft = float(data.get('total_sqft', 0))
        location = data.get('location', '')
        bhk = int(data.get('bhk', 0))
        bath = int(data.get('bath', 0))

        if not location or location == "":
            return jsonify({'error': 'Location is required'}), 400
        if total_sqft <= 0:
            return jsonify({'error': 'Invalid square footage'}), 400
        if bhk <= 0:
            return jsonify({'error': 'Invalid BHK value'}), 400
        if bath <= 0:
            return jsonify({'error': 'Invalid bathroom count'}), 400

        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
        print("Estimated price:", estimated_price)
        return jsonify({'estimated_price': estimated_price})
    except Exception as e:
        print("Error in predict_home_price:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__=='__main__':
    print("Starting Python Flask server for Home prediction")
    util.load_saved_artifacts()
    # Enable CORS headers
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.run(debug=True)