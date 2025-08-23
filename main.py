# ai_service.py
from flask import Flask, request, jsonify
from PIL import Image
import requests
import io
import numpy as np
from sklearn.cluster import KMeans
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route("/analyze", methods=["POST"])
def analyze_art():
    data = request.get_json()
    image_url = data["imageUrl"]

    # Download image
    response = requests.get(image_url)
    img = Image.open(io.BytesIO(response.content))

    # Example AI analysis
    dominant_colors = extract_colors(img)
    predicted_art_form = classify_art(img)  # your CNN model
    detected_objects = detect_objects(img)  # Vision API / YOLO

    analysis = {
        # Art Form Classification
        "predictedArtForm": predicted_art_form,
        "artFormConfidence": 0.92,
        "artStyleSubcategory": "Traditional Warli",
        "artPeriod": "Contemporary",
        "artRegion": "Maharashtra, India",
        
        # Color Analysis
        "dominantColors": dominant_colors,
        "colorPalette": ["#8B4513", "#FFD700", "#228B22", "#DC143C", "#4169E1"],
        "colorHarmony": "Warm and Earthy",
        "colorContrast": "Medium",
        "colorSaturation": "Moderate",
        "colorTemperature": "Warm",
        
        # Composition & Style
        "compositionType": "Balanced",
        "visualWeight": "Centered",
        "lineQuality": "Bold and Geometric",
        "textureAnalysis": "Rough and Natural",
        "patternDensity": "Medium",
        "symmetryLevel": "Asymmetric",
        
        # Object & Scene Detection
        "detectedObjects": detected_objects,
        "sceneType": "Village Life",
        "figureCount": 8,
        "animalPresence": ["birds", "cattle"],
        "naturalElements": ["trees", "sun", "moon"],
        "architecturalElements": ["huts", "fences"],
        
        # Cultural & Contextual Analysis
        "culturalContext": "Festival celebration",
        "ritualContext": "Harvest Festival",
        "seasonalAssociation": "Monsoon",
        "socialContext": "Community Gathering",
        "mythologicalReferences": ["nature spirits", "ancestral worship"],
        
        # Technical Quality
        "imageResolution": "High",
        "imageQuality": "Excellent",
        "printSuitability": "Premium",
        "marketplaceReady": True,
        "compressionArtifacts": "None",
        
        # Engagement & Marketing
        "suggestedTags": ["tribal", "nature", "geometric", "warli", "indian-folk-art"],
        "recommendedHashtags": ["#WarliArt", "#TribalArt", "#IndianFolkArt", "#TraditionalArt", "#CulturalHeritage"],
        "suggestedCaption": "Vibrant Warli art depicting village life and harvest celebrations",
        "targetAudience": ["Art Collectors", "Cultural Enthusiasts", "Interior Designers"],
        "priceRange": "$200-500",
        "marketplaceCategories": ["Folk Art", "Traditional", "Cultural", "Handmade"],
        
        # Artistic Merit
        "artisticComplexity": "Medium-High",
        "craftsmanshipQuality": "Excellent",
        "authenticityScore": 0.95,
        "culturalSignificance": "High",
        "collectorValue": "Premium",
        
        # Technical Specifications
        "aspectRatio": "4:3",
        "fileSize": "2.4 MB",
        "colorSpace": "RGB",
        "bitDepth": 24,
        "compressionType": "JPEG"
    }
    return jsonify(analysis)

# Extract dominant colors
def extract_colors(img, k=5):
    img = img.resize((150, 150))
    arr = np.array(img)
    arr = arr.reshape((-1, 3))
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(arr)
    colors = kmeans.cluster_centers_.astype(int).tolist()
    hex_colors = [f"#{r:02x}{g:02x}{b:02x}" for r,g,b in colors]
    return hex_colors

# Dummy classifier
def classify_art(img):
    return "Warli"  # replace with ML model

def detect_objects(img):
    return ["human figures", "sun"]  # placeholder

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

