function searchMember(){
    var id = document.getElementById("crewSelect").value;
    $.ajax({
        url: '/crewsearch/' + id,
        type: 'GET',
        success: function(result){
            window.location.replace("./");
        }
    });
}
