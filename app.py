from flask import Flask, render_template, request
from pickle import load
from numpy import argmax
import tensorflow as tf
from keras.preprocessing.sequence import pad_sequences
from keras.applications.vgg16 import VGG16
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.applications.vgg16 import preprocess_input
from keras.models import Model
from keras.models import load_model

app = Flask(__name__)

tokenizer = load(open('tokenizer.pkl', 'rb'))
max_length = 34
global graph
graph = tf.get_default_graph()
with graph.as_default():
	global model
	model = load_model('model_18.h5')

def extract_features(filename):
	model1 = VGG16()
	model1.layers.pop()
	model1 = Model(inputs=model1.inputs, outputs=model1.layers[-1].output)
	image = load_img(filename, target_size=(224, 224))
	image = img_to_array(image)
	image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
	image = preprocess_input(image)
	feature = model1.predict(image,verbose=0)

	return feature

def word_for_id(integer, tokenizer):
	for word, index in tokenizer.word_index.items():
		if index == integer:
			return word
	return None

def generate_desc(model, tokenizer, photo, max_length):
	#print("!!!!!!!!!!everything is fine!!!!!")
	in_text = 'startseq'
	for i in range(max_length):
		sequence = tokenizer.texts_to_sequences([in_text])[0]
		sequence = pad_sequences([sequence], maxlen=max_length)
		#print("loop"+str(i))
		yhat = model.predict([photo,sequence], verbose=0)
		yhat = argmax(yhat)
		word = word_for_id(yhat, tokenizer)
		if word is None:
			break
		in_text += ' ' + word
		if word == 'endseq':
			break
	#print("fine1")
	return in_text

@app.route("/")
def home():
    return render_template('webpage.html')

@app.route("/predict", methods=['GET', 'POST'])
def predict():
	#print("I was here 1")
	if request.method == 'POST':
		with graph.as_default():
			image = request.files['image']
			photo = extract_features(image)
			#print("fine2")
			description = generate_desc(model, tokenizer, photo, max_length)
			#print("fine3")
			description=description.rsplit(' ', 1)[0]
			description=description.split(' ', 1)[1]
			return render_template('predict.html', prediction = description, imgdata=image)

if __name__ == "__main__":
    app.run(host='0.0.0.0')
