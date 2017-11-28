function updateAircraft(id){
    $.ajax({
        url: '/aircraft/' + id,
        type: 'PUT',
        data: $('#update-aircraft').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}