from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
# Ideally, we would import EasyOCR here, but for this step we might mock it or assume availability.
# from easyocr import Reader

app = FastAPI(title="VeggiePlan API", version="1.0.0")

# --- Models ---
class IngredientAnalysis(BaseModel):
    is_vegan: bool
    animal_ingredients: List[str]
    detected_text: List[str]

# --- Mock Data/Logic for OCR ---
ANIMAL_INGREDIENTS = [
    "gelatin", "casein", "albumin", "whey", "lactose", "honey", "cochineal", 
    "shellac", "collagen", "lard", "tallow", "fish oil", "anchovy", "beef", 
    "pork", "chicken", "meat", "egg", "milk", "butter", "cream"
]

# --- Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome to VeggiePlan API"}

@app.post("/api/ocr/analyze", response_model=IngredientAnalysis)
async def analyze_ingredients(file: UploadFile = File(...)):
    """
    Analyzes an uploaded image for animal-based ingredients.
    Uses generic text extraction for now (mocked).
    """
    # In a real implementation:
    # content = await file.read()
    # reader = Reader(['en', 'ko'])
    # result = reader.readtext(content, detail=0)
    
    # Mocking the OCR result for demonstration
    mock_scanned_text = [
        "Ingredients:", "Wheat Flour", "Sugar", "Vegetable Oil", 
        "Salt", "Gelatin", "Natural Flavors"
    ]
    
    detected_animal_ingredients = []
    is_vegan = True
    
    for word in mock_scanned_text:
        clean_word = word.lower().strip()
        if clean_word in ANIMAL_INGREDIENTS:
            detected_animal_ingredients.append(word)
            is_vegan = False
            
    return {
        "is_vegan": is_vegan,
        "animal_ingredients": detected_animal_ingredients,
        "detected_text": mock_scanned_text
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
