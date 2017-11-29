function updateflight(id){
    $.ajax({
        url: '/flight/' + id,
        type: 'PUT',
        data: $('#update-flight').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}