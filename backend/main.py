from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from transformers import T5ForConditionalGeneration, T5Tokenizer
from transformers import GPT2Tokenizer, GPT2LMHeadModel
from transformers import AutoModelForCausalLM, AutoTokenizer
from docx import Document
import PyPDF2
from io import BytesIO
import joblib
import numpy as np
import torch

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client_text = []
salesperson_text = []


model = joblib.load("models/persona-classifier/persona-classifier.pkl")
tfidf_vectorizer = joblib.load("models/persona-classifier/tfidf_vectorizer.pkl")
optimized_thresholds = np.load("models/persona-classifier/optimized_thresholds.npy")
mlb = joblib.load('models/persona-classifier/multilabel_binarizer.pkl')

tokenizer = T5Tokenizer.from_pretrained('t5-base')
chatbot = T5ForConditionalGeneration.from_pretrained('models/chatbot')
# tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
# chatbot = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
chatbot.eval()

label_indices = {
    'income_level': [8, 14, 16],
    'decision_making_style' :[0, 3, 4, 10, 12],
    'risk_tolerance': [7, 13, 17],
    'buying_motivation': [1, 11, 19, 20, 24],
    'time_sensitivity': [2, 6, 15, 23],
    'receptiveness': [5, 9, 18, 20, 21]
}

async def extract_text_from_docx(file):
    doc = Document(file)
    return '\n'.join([para.text for para in doc.paragraphs])

async def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    return '\n'.join([page.extract_text() for page in reader.pages if page.extract_text()])

def parse_transcript(raw_text, selection, seperator):
    global client_text, salesperson_text
    lines = raw_text.splitlines()

    current_dialogue = ""
    for i, line in enumerate(lines):
        if seperator in line:
            if current_dialogue:
                if selection == 0:  # Salesperson starts
                    if len(salesperson_text) <= len(client_text):
                        salesperson_text.append(current_dialogue.strip())
                    else:
                        client_text.append(current_dialogue.strip())
                elif selection == 1:  # Client starts
                    if len(client_text) <= len(salesperson_text):
                        client_text.append(current_dialogue.strip())
                    else:
                        salesperson_text.append(current_dialogue.strip())

                current_dialogue = ""

            # Start a new dialogue
            current_dialogue = line.split(':', 1)[1].strip()
        else:
            current_dialogue += ' ' + line.strip()

    # Append the last dialogue if it exists
    if current_dialogue:
        if selection == 0:
            salesperson_text.append(current_dialogue.strip()) if len(salesperson_text) <= len(client_text) else client_text.append(current_dialogue.strip())
        elif selection == 1:
            client_text.append(current_dialogue.strip()) if len(client_text) <= len(salesperson_text) else salesperson_text.append(current_dialogue.strip())

@app.post("/predict-persona/")
async def predict(
    file: UploadFile = File(...),
    selection: int = Form(...),
    separator: str = Form(...),
):
    contents = await file.read()
    raw_text = ""

    print("selection is " + str(selection));

    if file.filename.endswith('.pdf'):
        raw_text = await extract_text_from_pdf(BytesIO(contents))
    elif file.filename.endswith('.docx'):
        raw_text = await extract_text_from_docx(BytesIO(contents))
    elif file.filename.endswith('.txt'):
        raw_text = contents.decode('utf-8')
    else:
        return {"error": "Unsupported file type."}

    salesperson_text.clear()
    client_text.clear()
    parse_transcript(raw_text, selection, separator)

    # print(client_text)
    # print(salesperson_text)

    training_text = ""
    for index, response in enumerate(client_text):
        # Before adding last client response, add salesperson text
        if index == len(client_text) - 1:
            if len(salesperson_text) > 0:
                training_text += salesperson_text[-1] + ' '
        training_text += response + ' '

    text_vector = tfidf_vectorizer.transform([training_text])
    prediction_probs = model.predict_proba(text_vector)

    class_labels = mlb.classes_
    index_to_class = {i: label for i, label in enumerate(class_labels)}
    # for idx, prob in enumerate(prediction_probs):  # Assuming a single input
    #     print(f"Class: {index_to_class[idx]}, Probability: {prob}")

    max_probs = {}
    for label, indices in label_indices.items():
        label_probs = []
        for index in indices:
            label_probs.append(prediction_probs[index][0][1])
        max_index = np.argmax(label_probs)
        class_index = indices[max_index]
        max_probs[label] = mlb.classes_[class_index]
    return {
        "persona_predictions" : max_probs,
        "salesperson_text": salesperson_text,
        "client_text": client_text,
    }

class ModelPromptRequest(BaseModel):
    modelPrompt: str

@app.post("/predict-response/")
async def predictResponse(request: ModelPromptRequest):
    user_model_prompt = request.modelPrompt

    input_ids = tokenizer.encode(user_model_prompt, return_tensors='pt')

    if len(input_ids[0]) > 300:
        input_ids = input_ids[:, -300:]

    attention_mask = torch.ones(input_ids.shape, dtype=torch.long)
    with torch.no_grad():  # Disable gradient calculation
        # outputs = chatbot.generate(
        #     input_ids=input_ids,
        #     max_length=150,
        #     num_beams=5,           # Use beam search for more diverse responses
        #     do_sample=True,        # Enable sampling to avoid deterministic outputs
        #     top_k=50,              # Control the diversity
        #     top_p=0.95,            # Control the diversity (nucleus sampling)
        #     temperature=1.0,       # Temperature to control randomness
        #     pad_token_id=tokenizer.pad_token_id,  # Ensure padding token is respected
        #     eos_token_id=tokenizer.eos_token_id
        # )   # Specify end-of-sequence token)
        outputs = chatbot.generate(
            input_ids=input_ids,
            attention_mask=attention_mask,
            max_new_tokens=150,
            num_beams=1,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.9,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id
        )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # response = "This is an AI generated message"

    return {
        "client_response" : response
    }

