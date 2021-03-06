// ########################## image controls ##################################

function readFile(input) {
    if (input.files && input.files[0]) {
	if(input.files[0].length>1){
		alert("Only 1 image can be uploaded !");
		myFormReset();
	}else{
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
}

function validateImage() {
    var formData = new FormData();
    var file = document.getElementById("img").files[0];
    if(file.length >1){
    	alert("asgdgfgj");
    }

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

// ########################### ui hide/show #############################

$(".dropzone").change(function() {
  readFile(this);
});

$('.dropzone-wrapper').on('dragover', function(e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).addClass('dragover');
});

$('.dropzone-wrapper').on('dragleave', function(e) {
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


// ############################### Finding Caption Upload ########################################

function setValueInId(capt){
    //var data=document.getElementById('ret').textContent=capt;
    var htmlPreview = '<h1 class="display-1" style="color: #fc6b03; font-size: 36px" >Image Caption Generated</h1>' +
            '<p class="lead">' + getPreText() + capt + '</p>';
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
                        //console.log("here in json");
                        s=d.toString();
                        setValueInId(s);
                        console.log(s);
                    }
                );

            }
            reader.readAsDataURL(input.files[0]);
        }
        return false;
    });
});

function getPreText() {
    var coolstr = [
        "I think ",
        "My best guess is ",
        "Oooweee, ",
        "All I see is ",
        "Hope I'm not wrong! "
    ];
    return coolstr[Math.floor(Math.random() * coolstr.length)];
}

//################################# Web Camera ######################################

Webcam.set({
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach('#my_camera'); 

function take_snapshot() {
    Webcam.snap(function (data_uri) {  
        console.log("snap taken inside");    
        document.getElementById('imgbodycam').innerHTML =
            '<img id="snapimg" src="' + data_uri + '"/>';
        $('.showBlockcam').removeClass('d-none');
        $('.hideBlockcam').addClass('d-none');
        Webcam.reset();
    });
}

function myCamReset() {
    Webcam.attach('#my_camera'); 
    document.getElementById("imgbodycam").innerHTML = "";
    $('.hideBlockcam').removeClass('d-none');
    $('.showBlockcam').addClass('d-none');
    document.getElementById("newCaptioncam").innerHTML = "";
}
$(function () {
    $('#findCaptioncam').bind('click', function () {
        var snapimg = document.getElementById('snapimg').src;
        if (snapimg != null) {
            document.getElementById("newCaptioncam").innerHTML =
        '<div class="loadAnimation"><span class="loader"><span class="loader-inner"></span></span><p style="margin : 100px 0 0 100px;" >Analyzing Image..</p></div>';
            var img = new Image();
            img.onload = function (e) {
                console.log("waiting predict");
                console.log(img.src);
                $.getJSON('/predict', {
                        x: img.src
                    },
                    function (d) {
                        //console.log("here in json");
                        s=d.toString();
                        setCamInId(s);
                        console.log(s);
                    }
                );

            }
            img.src=snapimg;
        }
        return false;
    });
});

function setCamInId(capt){
    //var data=document.getElementById('ret').textContent=capt;
    var htmlPreview = '<h1 class="display-1" style="color: #fc6b03; font-size: 36px" >Image Caption Generated</h1>' +
            '<p class="lead">' + getPreText() + capt + '</p>';
        document.getElementById("newCaptioncam").innerHTML = htmlPreview;
}


    /*
    if (window.screen.width < 480) {
        $('html,body').animate({
            scrollTop: $("#valueCaptioncam").offset().top
        },
            'slow');
    }
    document.getElementById("newCaptioncam").innerHTML =
        '<div class="loadAnimation"><span class="loader"><span class="loader-inner"></span></span><p style="margin : 100px 0 0 100px;" >Analyzing Image..</p></div>';
    setTimeout(function () {
        $(".loader-wrapper").fadeOut("slow");
        var data = "Two dogs are sitting in the park";
        data = getPreText() + data;
        var htmlPreview = '<h1 class="display-1" style="color: #fc6b03; font-size: 36px" >Image Caption Generated</h1>' +
            '<p class="lead">' + data + '</p>';
        document.getElementById("newCaptioncam").innerHTML = htmlPreview;
    }, 5000);

});*/
