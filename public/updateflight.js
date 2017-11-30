function updateflight(id){
    $.ajax({
        url: '/flights/' + id,
        type: 'PUT',
        data: $('#update-flight').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}
