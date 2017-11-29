function addCrewbase(){
    $.ajax({
        url: '/crew/crewbase',
        type: 'POST',
        data: $('#crew').serialize(),
        success: function(result){
            window.location.reload(true);
        }
    });
}