import {
    GoogleGenerativeAI
} from "@google/generative-ai";

const apiKey = "AIzaSyCDGobzYQWVmZIftRWG3Q5BNULNsVv4AfM";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export const GeminiAna = async (user, product) => {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(
        `You are a health and nutrition expert tasked with analyzing a product's suitability for a specific user based on their health profile. Your response must be strictly in JSON format without any additional text outside of the JSON object.

**Input Data:**

*   **User Profile:** (JSON Format)
    json
    {
        "age": ${user.age},
        "height_cm": ${user.height},
        "weight_kg": ${user.weight},
        "gender": ${user.gender},
        "allergies": ${user.allergies},
        "medical_history": ${user.medicalHistory},
        "blood_group": ${user.bloodGroup},
    }
    

*   **Product Details:** (JSON Format)
    json
    {
        "name": ${product.name},
        "category": ${product.category},
        "ingredients": ${product.ingredients},
        "nutrients": ${product.nutritions}
    }
    

**Output Format (JSON):*

json
{
    "nutrient_analysis": [
        {
            "nutrient_en": STRING,
            "nutrient_hi": STRING,
            "rating": INTEGER (1-10),
            "explanation_en": "STRING(Includes exact numeric values, overdose risks, and medical condition impact)",
            "explanation_hi": "STRING(Includes exact numeric values, overdose risks, and medical condition impact)"
        }
    ],
    "overall_analysis": {
        "rating": INTEGER (1-10),
        "explanation_en": "STRING(Detailed medical-based reasoning considering allergies, overdose risks, and medical conditions)",
        "explanation_hi": "STRING(Detailed medical-based reasoning considering allergies, overdose risks, and medical conditions)"
    },
    "suggested_alternatives": [
        {
            "name": STRING,
            "reason_en": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)",
            "reason_hi": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)"
        },
        {
            "name": STRING,
            "reason_en": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)",
            "reason_hi": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)"
        },
        {
            "name": STRING,
            "reason_en": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)",
            "reason_hi": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)"
        },
        {
            "name": STRING,
            "reason_en": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)",
            "reason_hi": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)"
        }
    ]
}
    
    **Response Generation Rules**
    1. Nutrient Ratings (1-10 Scale)
        1.1 1-3 → Harmful (Directly worsens medical conditions, allergies, or poses toxicity risks).
        1.2 4-6 → Moderate Risk (Not ideal but can be consumed in small amounts).
        1.3 7-10 → Beneficial (Supports deficiencies, prevents health risks, and provides optimal nutrition).
            ✅ Includes exact numeric values for each nutrient in the explanation.
            ✅ Identifies if a nutrient is excessive or deficient based on medical conditions.

    2. Overall Suitability Rating (1-10 Scale)
        2.1 1.0 - 2.5 → Avoid (Highly unsuitable due to medical/allergy risks).
        2.2 2.6 - 5.0 → Risky (Can be consumed in rare cases but not recommended).
        2.3 5.1 - 7.5 → Moderate (Can be consumed with caution, but alternatives are better).
        2.4 7.6 - 10.0 → Safe (Healthy, beneficial, and aligns with the user’s profile).
            ✅ Prioritizes allergies and medical conditions equally.
            ✅ Explains why the product is rated that way.

    3. Alternative Selection Criteria
        3.1 Strictly natural (no processed foods).
        3.2 Avoids allergy-triggering ingredients.
        3.3 Addresses medical conditions.
        3.4  Matches taste and texture of the original product where possible.`
    );

    const match = result.response.text().match(/```json\n([\s\S]*?)\n```/);
    const jsonData = JSON.parse(match[1]);
    console.log(jsonData);
    return jsonData
}

export const PhotoAna = async (user, productText) => {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(
        `You are a health and nutrition expert tasked with analyzing a product's suitability for a specific user based on their health profile. Your response must be strictly in JSON format without any additional text outside of the JSON object.

**Input Data:**

*   **User Profile:** (JSON Format)
    json
    {
        "age": ${user.age},
        "height_cm": ${user.height},
        "weight_kg": ${user.weight},
        "gender": ${user.gender},
        "allergies": ${user.allergies},
        "medical_history": ${user.medicalHistory},
        "blood_group": ${user.bloodGroup},
    }
    

*   **Product Details:** (JSON Format)
    json
    {
        "nutrients": ${productText}
    }
    

**Output Format (JSON):**

json
{
    "nutrient_analysis": [
        {
            "nutrient_en": STRING,
            "nutrient_hi": STRING,
            "rating": INTEGER (1-10),
            "explanation_en": "STRING(Includes exact numeric values, overdose risks, and medical condition impact)",
            "explanation_hi": "STRING(Includes exact numeric values, overdose risks, and medical condition impact)"
        }
    ],
    "overall_analysis": {
        "rating": INTEGER (1-10),
        "explanation_en": "STRING(Detailed medical-based reasoning considering allergies, overdose risks, and medical conditions)",
        "explanation_hi": "STRING(Detailed medical-based reasoning considering allergies, overdose risks, and medical conditions)"
    },
    "suggested_alternatives": [
        {
            "name": STRING,
            "reason_en": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)",
            "reason_hi": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)"
        },
        {
            "name": STRING,
            "reason_en": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)",
            "reason_hi": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)"
        },
        {
            "name": STRING,
            "reason_en": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)",
            "reason_hi": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)"
        },
        {
            "name": STRING,
            "reason_en": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)",
            "reason_hi": "STRING(Strictly natural, better for the user's health, and similar in taste/texture if relevant)"
        }
    ]
}
    
    **Response Generation Rules**
    1. Nutrient Ratings (1-10 Scale)
        1.1 1-3 → Harmful (Directly worsens medical conditions, allergies, or poses toxicity risks).
        1.2 4-6 → Moderate Risk (Not ideal but can be consumed in small amounts).
        1.3 7-10 → Beneficial (Supports deficiencies, prevents health risks, and provides optimal nutrition).
            ✅ Includes exact numeric values for each nutrient in the explanation.
            ✅ Identifies if a nutrient is excessive or deficient based on medical conditions.

    2. Overall Suitability Rating (1-10 Scale)
        2.1 1.0 - 2.5 → Avoid (Highly unsuitable due to medical/allergy risks).
        2.2 2.6 - 5.0 → Risky (Can be consumed in rare cases but not recommended).
        2.3 5.1 - 7.5 → Moderate (Can be consumed with caution, but alternatives are better).
        2.4 7.6 - 10.0 → Safe (Healthy, beneficial, and aligns with the user’s profile).
            ✅ Prioritizes allergies and medical conditions equally.
            ✅ Explains why the product is rated that way.

    3. Alternative Selection Criteria
        3.1 Strictly natural (no processed foods).
        3.2 Avoids allergy-triggering ingredients.
        3.3 Addresses medical conditions.
        3.4  Matches taste and texture of the original product where possible.`
    );

    const match = result.response.text().match(/```json\n([\s\S]*?)\n```/);
    const jsonData = JSON.parse(match[1]);
    return jsonData;
}


export const SuggestFood = async (user) => {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(
        `{
            "prompt": "You are a nutrition expert tasked with creating a personalized food recommendation list for a user based on their profile. The goal is to suggest 15 natural foods that align with the user's needs and potential health concerns. The output should be a JSON response detailing each food recommendation, including its benefits, category, and image URL (if available).",
            "userProfile": {
              "description": "User's personal information, including age, weight, height, gender, allergies, and medical history.",
              "fields": {
                "age": ${user.age},
                "weight": ${user.weight},
                "height": ${user.height},
                "gender": ${user.gender},
                "allergies": ${user.allergies},
                "medicalHistory": ${user.medicalHistory}
              },
              "example": {
                "age": 45,
                "weight": 75.5,
                "height": 178.0,
                "gender": "male",
                "allergies": ["dairy"],
                "medicalHistory": ["high blood pressure", "high cholesterol"]
              }
            },
            "outputFormat": {
              "description": "A JSON object containing a list of 15 food recommendations.",
              "structure": {
                "foodRecommendations": [
                  {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": {
                      "type": "string",
                      "description": "The name of the recommended food product (e.g., 'Spinach', 'Almonds', 'Salmon').",
                    },
                    "benefits": {
                      "type": "string",
                      "description": "A detailed description of the health benefits of this food, specifically tailored to the user's profile.  Explain how it helps with their medical history, addresses potential deficiencies, or avoids allergens (e.g., 'Rich in iron, helping to combat potential anemia.  Also, dairy-free, avoiding allergic reactions.')."
                    },
                    "category_en": STRING,
                    "category_hi": STRING,
                    "category": {
                      "type": "string",
                      "description": "The category of the food (e.g., 'Vegetables', 'Fruits', 'Nuts and Seeds', 'Protein', 'Grains', 'Legumes')."
                    },
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                  {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                  {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  },
                   {
                    "productName_en": STRING,
                    "productName_hi": STRING,
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                    "category_en": STRING,
                    "category_hi": STRING,
                    "benefits_en": STRING,
                    "benefits_hi": STRING,
                  }
          
                ]
              }
            },
            "constraints": [
              "Suggest only natural, whole foods (not processed or packaged foods).",
              "Prioritize foods that directly address the user's medical history (e.g., recommend foods that help manage high blood pressure or cholesterol).",
              "Absolutely avoid suggesting any foods the user is allergic to.",
              "If no image URL is available, set the imageURL field to null.",
              "Provide diverse recommendations across various food categories (Vegetables, Fruits, Nuts and Seeds, Protein, Grains, Legumes).",
              "The benefits description should be concise but informative, clearly linking the food to the user's specific needs.",
               "Ensure all URLs are valid and functional. If the URL is broken, set imageURL to null."
            ],
              "example_user_input": {
                "age": 45,
                "weight": 75.5,
                "height": 178.0,
                "gender": "male",
                "allergies": ["dairy"],
                "medicalHistory": ["high blood pressure", "high cholesterol"]
              }
          }`
    );

    const match = result.response.text().match(/```json\n([\s\S]*?)\n```/);
    const jsonData = JSON.parse(match[1]);
    return jsonData;
}