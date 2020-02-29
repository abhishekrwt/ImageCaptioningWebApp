function readFile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            //console.log(e.target.v);
            if (validateImage()) {
                var htmlPreview =
                    '<img src="' + e.target.result +
                    '"alt="Image not Loaded" />';
                document.getElementById("imgbody").innerHTML = htmlPreview;
                $('.showBlock').removeClass('d-none');
                $('.hideBlock').addClass('d-none');
            } else {
                myFormReset();
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function validateImage() {
    var formData = new FormData();

    var file = document.getElementById("img").files[0];

    formData.append("Filedata", file);
    var t = file.type.split('/').pop().toLowerCase();
    if (t != "jpeg" && t != "jpg" && t != "png" && t != "bmp" && t != "gif") {
        alert('Please select a valid image file');
        return false;
    }
    if (file.size > 2048000) {
        alert('Max Upload size is 2MB only');
        return false;
    }
    return true;
}


$(".dropzone").change(function () {
    readFile(this);
});

$('.dropzone-wrapper').on('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass('dragover');
});

$('.dropzone-wrapper').on('dragleave', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass('dragover');
});

function myFormReset() {
    document.getElementById("imgbody").innerHTML = "";
    document.getElementById("myForm").reset();
    $('.hideBlock').removeClass('d-none');
    $('.showBlock').addClass('d-none');
    document.getElementById("newCaption").innerHTML = "";
}

function setValueInId(capt){
    var data=document.getElementById('ret').textContent=capt;
    var htmlPreview = '<h1 class="display-1" style="color: #fc6b03; font-size: 36px" >Image Caption Generated</h1>' +
            '<p class="lead">' + data + '</p>';
        document.getElementById("newCaption").innerHTML = htmlPreview;
}

$(function () {
    $('#findCaptions').bind('click', function () {
        var input = document.getElementById('img');
        if (input.files && input.files[0]) {
            document.getElementById("newCaption").innerHTML =
        '<div class="loadAnimation"><span class="loader"><span class="loader-inner"></span></span><p style="margin : 100px 0 0 100px;" >Analyzing Image..</p></div>';
            var reader = new FileReader();
            reader.onload = function (e) {
                console.log("waiting predict")
                $.getJSON('/predict', {
                        x: e.target.result
                    },
                    function (d) {
                        console.log("here in json");
                        s=d.toString();
                        setValueInId(s);
                        //document.getElementById('ret').textContent=s;
                        console.log(s);
                    }
                );

            }
            reader.readAsDataURL(input.files[0]);
        }
        return false;
    });
});

$('#findCaption').bind('click', function () {
    document.getElementById("newCaption").innerHTML =
        '<div class="loadAnimation"><span class="loader"><span class="loader-inner"></span></span><p style="margin : 100px 0 0 100px;" >Analyzing Image..</p></div>';
    setTimeout(function () {
        $(".loader-wrapper").fadeOut("slow");
        var data = "Two dogs are sitting in the park";
        var htmlPreview = '<h1 class="display-1" style="color: #fc6b03; font-size: 36px" >Image Caption Generated</h1>' +
            '<p class="lead">' + data + '</p>';
        document.getElementById("newCaption").innerHTML = htmlPreview;
    }, 5000);

});

/*
 
##########################flask code################################

LEFT, RIGHT, UP, DOWN, RESET = "left", "right", "up", "down", "reset"
AVAILABLE_COMMANDS = {
    'Left': LEFT,
    'Right': RIGHT,
    'Up': UP,
    'Down': DOWN,
    'Reset': RESET
}

@app.route('/')
def execute():
    return render_template('main.html', commands=AVAILABLE_COMMANDS)

@app.route('/<cmd>')
def command(cmd=None):
    if cmd == RESET:
       camera_command = "X"
       response = "Resetting ..."
    else:
        camera_command = cmd[0].upper()
        response = "Moving {}".format(cmd.capitalize())

    # ser.write(camera_command)
    return response, 200, {'Content-Type': 'text/plain'}

#########################javascript code##############################
 {# in main.html #}
{% for label, command in commands.items() %}
    <button class="command command-{{ command }}" value="{{ command }}">
        {{ label }}
    </button>
{% endfor %}

{# and then elsewhere #}
<script>
// Only run what comes next *after* the page has loaded
addEventListener("DOMContentLoaded", function() {
  // Grab all of the elements with a class of command
  // (which all of the buttons we just created have)
  var commandButtons = document.querySelectorAll(".command");
  for (var i=0, l=commandButtons.length; i<l; i++) {
    var button = commandButtons[i];
    // For each button, listen for the "click" event
    button.addEventListener("click", function(e) {
      // When a click happens, stop the button
      // from submitting our form (if we have one)
      e.preventDefault();

      var clickedButton = e.target;
      var command = clickedButton.value;

      // Now we need to send the data to our server
      // without reloading the page - this is the domain of
      // AJAX (Asynchronous JavaScript And XML)
      // We will create a new request object
      // and set up a handler for the response
      var request = new XMLHttpRequest();
      request.onload = function() {
          // We could do more interesting things with the response
          // or, we could ignore it entirely
          alert(request.responseText);
      };
      // We point the request at the appropriate command
      request.open("GET", "/" + command, true);
      // and then we send it off
      request.send();
    });
  }
}, true);
</script>
 */


/*
 
//rendering the HTML page which has the button
@app.route('/json')
def json():
    return render_template('json.html')

//background process happening without any refreshing
@app.route('/background_process_test')
def background_process_test():
    print "Hello"
    return "nothing"


 <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type=text/javascript>
        $(function() {
          $('a#test').bind('click', function() {
            $.getJSON('/background_process_test',
                function(data) {
              //do nothing
            });
        return false;
      });
    });
</script>


//button
<div class='container'>
<h3>Test</h3>
    <form>
        <a href=# id=test><button class='btn btn-default'>Test</button></a>
    </form>

</div>
 
 */