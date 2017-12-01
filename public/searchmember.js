var id = document.getElementById("crewSelect").value;

function searchMember(id){
    $.ajax({
        url: '/crewsearch/' + id,
        type: 'GET',
        success: function(result){
            window.location.replace("./");
        }
    });
}