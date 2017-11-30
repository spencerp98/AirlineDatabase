function deleteCrewFlight(id){
    $.ajax({
        url: '/flights/assignment/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}