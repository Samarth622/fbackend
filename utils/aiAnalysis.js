import {
    GoogleGenerativeAI
} from "@google/generative-ai";

const apiKey = "AIzaSyDw5bMsoN-7sV1qBPsqX5pcFVYPbn6Ahek";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1.5,
    topP: 0.98,
    topK: 44,
    maxOutputTokens: 8392,
    responseMimeType: "text/plain",
};

export const GeminiAna = async (user, product) => {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(
        `You are a health and nutrition expert tasked with analyzing a product's suitability for a specific user based on their health profile. You will receive user details and product details in JSON format. Your output should be a JSON object containing a nutrient-by-nutrient analysis with their rating(1 to 10) and explanation, an overall suitability rating(1 to 5) with overall conclusion, and suggestions for alternative 4 natural products.

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
        "menstrual_cycle": np ("regular" or "irregular" - only include if gender is "female"),
        "pregnancy_status": no ("pregnant", "not pregnant", "unsure" - only include if gender is "female")
    }
    

*   **Product Details:** (JSON Format)
    json
    {
        "name": ${product.name},
        "category": ${product.category},
        "ingredients": ${product.ingredients},
        "nutrients": ${product.nutritions}
    }
    

**Output Format (JSON):**

json
{
    "nutrient_analysis": [
        {
            "nutrient": STRING (e.g., "Protein"),
            "rating": INTEGER (1-10),
            "explanation": STRING (1-2 sentence explanation of the rating in relation to the user's profile)
        },
        {
            "nutrient": STRING (e.g., "Sugar"),
            "rating": INTEGER (1-10),
            "explanation": STRING (1-2 sentence explanation of the rating in relation to the user's profile)
        },
        // ... more nutrients ...
    ],
    "overall_analysis": {
        "rating": INTEGER (1-5),
        "explanation": STRING (Overall summary of how suitable the product is for the user, considering all factors)
    },
    "suggested_alternatives": [
        {
            "name": STRING,
            "reason": STRING (1-2 sentence explanation of why this alternative is beneficial for the user)
        },
        {
            "name": STRING,
            "reason": STRING (1-2 sentence explanation of why this alternative is beneficial for the user)
        },
        {
            "name": STRING,
            "reason": STRING (1-2 sentence explanation of why this alternative is beneficial for the user)
        },
        {
            "name": STRING,
            "reason": STRING (1-2 sentence explanation of why this alternative is beneficial for the user)
        }
    ]
}`
    );

    const match = result.response.text().match(/```json\n([\s\S]*?)\n```/);
    const jsonData = JSON.parse(match[1]);
    return jsonData
}

export const PhotoAna = async (user, productText) => {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(
        `You are a health and nutrition expert tasked with analyzing a product's suitability for a specific user based on their health profile. You will receive user details and product details in JSON format. Your output should be a JSON object containing a nutrient-by-nutrient analysis with their rating(1 to 10) and explanation, an overall suitability rating(1 to 5) with overall conclusion, and suggestions for alternative 4 natural products.

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
        "blood_group": ${user.bloodGroup}
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
            "nutrient": STRING (e.g., "Protein"),
            "rating": INTEGER (1-10),
            "explanation": STRING (1-2 sentence explanation of the rating in relation to the user's profile)
        },
        {
            "nutrient": STRING (e.g., "Sugar"),
            "rating": INTEGER (1-10),
            "explanation": STRING (1-2 sentence explanation of the rating in relation to the user's profile)
        },
        // ... more nutrients ...
    ],
    "overall_analysis": {
        "rating": INTEGER (1-5),
        "explanation": STRING (Overall summary of how suitable the product is for the user, considering all factors)
    },
    "suggested_alternatives": [
        {
            "name": STRING,
            "reason": STRING (1-2 sentence explanation of why this alternative is beneficial for the user)
        },
        {
            "name": STRING,
            "reason": STRING (1-2 sentence explanation of why this alternative is beneficial for the user)
        },
        {
            "name": STRING,
            "reason": STRING (1-2 sentence explanation of why this alternative is beneficial for the user)
        },
        {
            "name": STRING,
            "reason": STRING (1-2 sentence explanation of why this alternative is beneficial for the user)
        }
    ]
}`
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
                    "productName": {
                      "type": "string",
                      "description": "The name of the recommended food product (e.g., 'Spinach', 'Almonds', 'Salmon')."
                    },
                    "benefits": {
                      "type": "string",
                      "description": "A detailed description of the health benefits of this food, specifically tailored to the user's profile.  Explain how it helps with their medical history, addresses potential deficiencies, or avoids allergens (e.g., 'Rich in iron, helping to combat potential anemia.  Also, dairy-free, avoiding allergic reactions.')."
                    },
                    "category": {
                      "type": "string",
                      "description": "The category of the food (e.g., 'Vegetables', 'Fruits', 'Nuts and Seeds', 'Protein', 'Grains', 'Legumes')."
                    },
                  },
                  {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                  {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
                  },
                   {
                    "productName": "...",
                    "benefits": "...",
                    "category": "...",
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