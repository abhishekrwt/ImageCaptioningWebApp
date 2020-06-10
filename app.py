from flask import Flask, render_template, request, jsonify
import numpy as np
from PIL import Image
from keras.models import model_from_json
import pickle
import tensorflow as tf
from tensorflow.python.keras import backend as K
from tensorflow.python.keras.models import Model
from tensorflow.python.keras.applications import VGG16
from tensorflow.python.keras.preprocessing.text import Tokenizer
import base64
from tensorflow.python.keras.backend import set_session

from token_wrapper import TokenizerWrap

app = Flask(__name__)

sess = tf.compat.v1.Session()
global graph
graph = tf.compat.v1.get_default_graph()
with graph.as_default():
	set_session(sess)
	global model
	model = tf.keras.models.load_model('model_and_weights.h5')
	print("Loaded model from disk")

captions_train_flat = open('captions_train_flat.pkl','rb')
captions_train_flat = pickle.load(captions_train_flat)
num_words = 10000

tokenizer = TokenizerWrap(texts=captions_train_flat, num_words=num_words)

image_model = VGG16(include_top=True, weights='imagenet')

img_size = K.int_shape(image_model.input)[1:3]
img_size

transfer_layer = image_model.get_layer('fc2')

image_model_transfer = Model(inputs=image_model.input, outputs=transfer_layer.output)

img_size = K.int_shape(image_model.input)[1:3]
img_size

mark_start = 'ssss '
mark_end = ' eeee'
token_start = tokenizer.word_index[mark_start.strip()]
token_start


token_end = tokenizer.word_index[mark_end.strip()]
token_end


def load_image(path, size=None):
    img = Image.open(path)
    if not size is None:
        img = img.resize(size=size, resample=Image.LANCZOS)
    img = np.array(img)
    img = img / 255.0
    if (len(img.shape) == 2):
        img = np.repeat(img[:, :, np.newaxis], 3, axis=2)
    return img

def generate_caption(image_path, max_tokens=30):
    image = load_image(image_path, size=img_size)
    image_batch = np.expand_dims(image, axis=0)
    transfer_values = image_model_transfer.predict(image_batch)
    shape = (1, max_tokens)
    decoder_input_data = np.zeros(shape=shape, dtype=np.int)
    token_int = token_start
    output_text = ''
    count_tokens = 0
    while token_int != token_end and count_tokens < max_tokens:
        decoder_input_data[0, count_tokens] = token_int
        x_data = {'transfer_values_input': transfer_values, 'decoder_input': decoder_input_data}
        decoder_output = model.predict(x_data)
        decoder_output
        token_onehot = decoder_output[0, count_tokens, :]
        token_int = np.argmax(token_onehot)
        if token_int == token_end:
            break
        sampled_word = tokenizer.token_to_word(token_int)
        output_text += " " + sampled_word
        count_tokens += 1
    output_tokens = decoder_input_data[0]
    output_tokens
    print("Predicted caption:")
    print(output_text)
    return output_text


@app.route("/")
def home():
    return render_template('index.html')


@app.route("/predict", methods=['GET','POST'])
def predict():
	with graph.as_default():
		set_session(sess)
		image = request.args.get('x')
		image=image[23:]
		imgdata = base64.b64decode(image)
		fh = open("uploadimage.jpg", "wb")
		fh.write(imgdata)
		fh.close()
		print("fine2")
		description = generate_caption("uploadimage.jpg")
		print(description)
		return jsonify(description)
		# return render_template('index.html', prediction = description)

if __name__ == "__main__":
	print("when")
	app.run(threaded=True, port=5000)
