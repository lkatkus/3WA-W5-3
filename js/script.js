// BUTTON LISTENER
$("#btn-list").click(displayList);
$("#btn-new").click(displayNew);

// FUNCTIONS
function displayList(){
    console.log("LIST");
    $("#myContainer").empty();

    $.get("http://192.168.1.81:8080/list", function(data){
        for(var i = 0; i < data.length; i++){

            // CREATE ROW FOR USER INFORMATION
            let userRow = $("<div></div>");
            $("#myContainer").append(userRow)
            $(userRow).addClass("userRow");

            // ADD USER INFO
            $(userRow).append("<span>NAME: </span>" + data[i].userName + "<span> MAIL: </span>" + data[i].eMail + "<span> AGE: </span>" + data[i].age + "<span> ID: </span>" + data[i].id)

            // ADD MANIPULATION BUTTONS
            $(userRow).append('<button id="' + data[i].id + '" type="button" name="button" onclick="deleteUser()">Delete</button>');
            $(userRow).append('<button id="' + data[i].id + '" type="button" name="button" onclick="updateUser()">Update</button>');
        }
    });
}

function displayNew(){

    // EMPTY CONTAINER
    $("#myContainer" ).empty();

    // CREATE FORM
    $("#myContainer" ).append('<form id="submitForm" action="index.html" method="post">');
    $("form").append('<div class="row"><input id="userName" type="text" name="userName" value="default Name"><label for="userName">Username</label></div>');
    $("form").append('<div class="row"><input id="userEmail" type="text" name="userEmail" value="default Email"><label for="userEmail">Email</label></div>');
    $("form").append('<div class="row"><input id="userAge" type="number" name="userAge" value="10"><label for="userAge">Age</label></div>');
    $("form").append('<button id="btn-submit" type="button" name="button">Submit</button>');
    $("form").append('<button id="btn-cancel" type="button" name="button">Cancel</button>');

    // CREATE BUTTONS
    $("#btn-cancel").click(displayList);
    $("#btn-submit").click(formJSON);
}

function formJSON(){
    var newUser = new Object();

    // GET INPUT DATA AND ADD TO OBJECT
    $("#submitForm").find(":input").each(function(){

        if(this.name == "userName"){
            newUser.userName = this.value;
        }else if(this.name == "userEmail"){
            newUser.eMail = this.value;
        }else if(this.name == "userAge"){
            newUser.age = parseInt(this.value);
        }
    })

    // MAKE JSON OBJECT
    var newJSON = JSON.stringify(newUser);

    // PASS DATA FOR SUBMITTING
    submitJSON(newJSON);
}

function submitJSON(newUser){

    $.ajax({
        type: "POST",
        url: "http://192.168.1.81:8080/add",
        data: newUser,
        success: function(data){
            console.log(data.error);
            displayList();
            },
        dataType: "json",
        contentType: "application/json"
    });
}

function deleteUser(){
    let deleteUserId = JSON.stringify({id:Number(event.target.id)});
    console.log(deleteUserId);

    $.ajax({
        type: "POST",
        url: "http://192.168.1.81:8080/delete",
        data: deleteUserId,
        success: function(data){
            console.log(data.error);
            displayList();
            },
        dataType: "json",
        contentType: "application/json"
    });


}

function updateUser(){
    console.log(event.target.id);
}

// http://192.168.1.81:8080/list GET request
//
//
//
// http://192.168.1.81:8080/add POST request
// username
// email
// age
//
// http://192.168.1.81:8080/update POST request
//
// http://192.168.1.81:8080/delete POST give id
