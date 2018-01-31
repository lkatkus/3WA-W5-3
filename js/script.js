$(function() {

    // BUTTON LISTENER
    $("#btn-list").click(displayList);
    $("#btn-new").click(displayNew);
});

// VARIABLES FOR UPDATING

// REDUCE USAGE OF GLOBAL VARIABLES
var updateData = false;

// DATA HANDLING ARRAY
var userInfoArr = [];

// FUNCTION DECLARATIONS

function displayList(){

    $("#myContainer").empty();

    $.get("http://192.168.1.81:8080/list", function(data){

        // EMPTY USER INFO ARRAY
        userInfoArr = data;

        for(let i = 0, j = data.length; i < j; i++){

            // CREATE ROW FOR USER INFORMATION
            let userRow = $("<div></div>");
            $(userRow).addClass("userRow");

            // DISPLAY USER INFO
            let newSpan = $("<span></span>")
            $(newSpan).text(data[i].userName);
            $(userRow).append(newSpan);

            newSpan = $("<span></span>")
            $(newSpan).text(data[i].eMail);
            $(userRow).append(newSpan);

            newSpan = $("<span></span>")
            $(newSpan).text(data[i].age);
            $(userRow).append(newSpan);
            $("#myContainer").append(userRow)

            // ADD MANIPULATION BUTTONS
            $(userRow).append('<button value="' + data[i].id + '" type="button" name="button" onclick="deleteUser('+ data[i].id + ')">Delete</button>');
            $(userRow).append('<button value="' + data[i].id + '" type="button" name="button" onclick="updateUser('+ data[i].id +')">Update</button>');
        }
    });
}

function displayNew(){
    // CHECKING STATE. FALSE IF NEW USER.
    updateData = false;

    // EMPTY CONTAINER
    $("#myContainer" ).empty();

    // CREATE FORM
    $("#myContainer" ).append('<form id="submitForm">');
    $("#submitForm").append('<div class="row"><input id="userName" type="text" name="userName" value="default Name"><label for="userName">Username</label></div>');
    $("#submitForm").append('<div class="row"><input id="userEmail" type="text" name="userEmail" value="default Email"><label for="userEmail">Email</label></div>');
    $("#submitForm").append('<div class="row"><input id="userAge" type="number" name="userAge" value="10"><label for="userAge">Age</label></div>');

    // CREATE BUTTON
    $("#submitForm").append('<button id="btn-submit" type="button" name="button">Submit</button>');
    $("#submitForm").append('<button id="btn-cancel" type="button" name="button">Cancel</button>');
    $("#btn-cancel").click(displayList);
    $("#btn-submit").click(submitJSON);
}

function formJSON(userTarget){
    let newUserObject = {};

    // GET INPUT DATA AND ADD TO OBJECT
    newUserObject.userName = $('#userName').val();
    newUserObject.eMail = $('#userEmail').val();
    newUserObject.age = parseInt($('#userAge').val());

    if(updateData){
        console.log("ADDING UPDATING ID");
        newUserObject.id = userTarget.id;
    }

    // MAKE JSON OBJECT
    var newJSON = JSON.stringify(newUserObject);

    // RETURN FORMED JSON
    return(newJSON);
}

function submitJSON(userTarget){

    let newUser = formJSON(userTarget);

    if(!updateData){
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
    }else{
        $.ajax({
            type: "POST",
            url: "http://192.168.1.81:8080/update",
            data: newUser,
            success: function(data){
                console.log(data.error);
                displayList();
            },
            dataType: "json",
            contentType: "application/json"
        });
    }
}

function deleteUser(deleteUserId){
    let deleteUser = JSON.stringify({id:deleteUserId});

    $.ajax({
        type: "POST",
        url: "http://192.168.1.81:8080/delete",
        data: deleteUser,
        success: function(data){
            console.log(data.error);
            displayList(); /* !!! AJAX IS ASYNCHRONOUS !!! */
        },
        dataType: "json",
        contentType: "application/json"
    });
}

function updateUser(updateUserId){
    updateData = true;
    userTargetId = updateUserId;

    // GET DATA TO UPDATE FROM LIST
    let existingName;
    let existingEmail;
    let existingAge;

    for(let i = 0, j = userInfoArr.length; i < j; i++){
        if(userInfoArr[i].id == updateUserId){
            createForm(userInfoArr[i]);
            break;
        }
    }
}

function createForm(userTarget){

    // EMPTY CONTAINER
    $("#myContainer" ).empty();

    // CREATE BASIC FORM LAYOUT
    $("#myContainer" ).append('<form id="submitForm" action="index.html" method="post">');
    $("form").append('<div class="row"><input id="userName" type="text" name="userName" value="default Name"><label for="userName">Username</label></div>');
    $("form").append('<div class="row"><input id="userEmail" type="text" name="userEmail" value="default Email"><label for="userEmail">Email</label></div>');
    $("form").append('<div class="row"><input id="userAge" type="number" name="userAge" value="10"><label for="userAge">Age</label></div>');

    // ADDING INFORMATION IF UPDATING USER
    if(updateData){
        // ADD EXISTING USER DATA
        $("#userName").val(userTarget.userName);
        $("#userEmail").val(userTarget.eMail);
        $("#userAge").val(userTarget.age);
    }

    // CREATE BUTTONS
    $("form").append('<button id="btn-submit" type="button" name="button">Submit</button>');
    $("form").append('<button id="btn-cancel" type="button" name="button">Cancel</button>');

    // ADD EVENT LISTENERS TO BTNS
    $("#btn-cancel").click(displayList);
    $("#btn-submit").click(function(){
        submitJSON(userTarget);
    });
}
