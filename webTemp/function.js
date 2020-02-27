function readFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var htmlPreview =
            '<img src="' + e.target.result +
            '" class="img-fluid" alt="Responsive image" />';
        document.getElementById("imgbody").innerHTML = htmlPreview;
        $('.hideBlock').addClass('d-none');
        $('.twoButtons').removeClass('px-1');
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
        document.getElementById("img").value = '';
        return false;
    }
    if (file.size > 1024000) {
        alert('Max Upload size is 1MB only');
        document.getElementById("img").value = '';
        return false;
    }
    return true;
}


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
    $('.twoButtons').addClass('px-1');
}