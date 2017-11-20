function deleteCrew(id){
    $.ajax({
        url: '/crew/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}