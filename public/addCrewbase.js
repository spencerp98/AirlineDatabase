function addCrewbase(){
    $.ajax({
        url: '/crew/crewbase',
        type: 'POST',
        data: $('#add-crewbase').serialize(),
        success: function(result){
            window.location.reload(true);
        }
    });
}