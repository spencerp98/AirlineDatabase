function deleteAircraft(id){
    $.ajax({
        url: '/aircraft/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}