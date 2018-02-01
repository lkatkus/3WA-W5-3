// INITIAL FUNCTION
$(function() {
    // BUTTON LISTENER
    $("#btn-list").click(displayList);
    $("#btn-new").click(function(){
        displayNew();
    });
});

// DATA HANDLING ARRAY
var userInfoArr = [];

// FUNCTION DECLARATIONS
function displayList(){

    $("#myContainer").empty();

    // // LONG AJAX
    $.ajax({
        method: "GET",
        url: "http://192.168.1.81:8080/list",
        success: function(data){
            // ADD INFO TO EMPTY USER INFO ARRAY FROM SERVER
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
                $(userRow).append('<button type="button" name="button" onclick="deleteUser('+ data[i].id + ')">Delete</button>');
                $(userRow).append('<button type="button" name="button" onclick="displayNew('+ data[i].id +')">Update</button>');
            }

        },
        error: function(response){
                console.log('error');
        },
        dataType: "json",
        contentType: "application/json"
    });
}

function displayNew(id){

    // EMPTY CONTAINER
    $("#myContainer" ).empty();

    // CREATING INPUTS
    $("#myContainer" ).append('<form id="submitForm">');
    $("#submitForm").append('<div class="row"><input id="userName" type="text" name="userName" value="default Name"><label for="userName">Username</label></div>');
    $("#submitForm").append('<div class="row"><input id="userEmail" type="text" name="userEmail" value="default Email"><label for="userEmail">Email</label></div>');
    $("#submitForm").append('<div class="row"><input id="userAge" type="number" name="userAge" value="10"><label for="userAge">Age</label></div>');

    // IF UPDATING USER ID IS PASSED. ADD INFO TO FORM
    if(id){
        for(let i = 0; i < userInfoArr.length; i++){
            if(userInfoArr[i].id == id){
                $("#userName").val(userInfoArr[i].userName);
                $("#userEmail").val(userInfoArr[i].eMail);
                $("#userAge").val(userInfoArr[i].age);
                break;
            }
        }
    }

    // ADDING BUTTONS
    $("#submitForm").append('<button id="btn-submit" type="button" name="button">Submit</button>');
    $("#submitForm").append('<button id="btn-cancel" type="button" name="button">Cancel</button>');

    $("#btn-cancel").click(displayList);
    $("#btn-submit").click(function(){
        if(id){
            submitJSON(id);
        }else{
            submitJSON();
        }
    });
}

function submitJSON(id){

    // CREATE USER OBJECT FROM INPUTS
    let newUserObject = {
        userName: $('#userName').val(),
        eMail: $('#userEmail').val(),
        age: parseInt($('#userAge').val())
    };

    // ADD ID TO USER IF UPDATING
    if(id){
        newUserObject.id = id;
    }

    // ADD NEW USER PATH
    if(!id){
        $.ajax({
            method: "POST",
            url: "http://192.168.1.81:8080/add",
            data: JSON.stringify(newUserObject),
            success: function(data){
                displayList();
            },
            error: function(response){
                console.log(response);
            },
            dataType: "json",
            contentType: "application/json"
        });
    }

    // UPDATE PATH
    else{
        $.ajax({
            method: "POST",
            url: "http://192.168.1.81:8080/update",
            data: JSON.stringify(newUserObject),
            success: function(data){
                displayList();
            },
            error: function(response){
                console.log(response);
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
            displayList(); /* !!! AJAX IS ASYNCHRONOUS !!! */
        },
        error: function(response){
            console.log(response);
        },
        dataType: "json",
        contentType: "application/json"
    });
}
