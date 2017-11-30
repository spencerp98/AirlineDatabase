function searchMember(id){
    $.ajax({
        url: '/crewsearch/' + id,
        type: 'GET',
        data: $('#searchCrew').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}