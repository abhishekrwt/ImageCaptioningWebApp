$(function(){
    // for sample 1
    $('#cropbox1').Jcrop({ // we linking Jcrop to our image with id=cropbox1
        aspectRatio: 1,
        onChange: updateCoords,
        onSelect: updateCoords
    });
});

function updateCoords(c) {
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);

    $('#x2').val(c.x2);
    $('#y2').val(c.y2);


    var rx = 200 / c.w; // 200 - preview box size
    var ry = 200 / c.h;

    $('#preview').css({
        width: Math.round(rx * 600) + 'px',
        height: Math.round(ry * 400) + 'px',
        marginLeft: '-' + Math.round(rx * c.x) + 'px',
        marginTop: '-' + Math.round(ry * c.y) + 'px'
    });
};

function checkCoords() {
    if (parseInt($('#w').val())) return true;
    alert('Please select a crop region then press submit.');
    return false;
};