function searchMember(){
    var id = document.getElementById("crewSelect").value;
    window.open("./crewsearch/" + id, "_self");
    // $.ajax({
    //     url: '/crewsearch/' + id,
    //     type: 'GET',
    //     success: function(result){
    //         window.location.replace("./");
    //     }
    // });
}
