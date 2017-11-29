function deleteflight(id){
    $.ajax({
        url: '/flights/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}