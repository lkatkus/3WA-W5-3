$(function() {

        // BUTTON LISTENER
    $("#btn-list").click(displayList);
    $("#btn-new").click(displayNew);

    // VARIABLES FOR UPDATING
    var updateData = false;
    var updatedId;
    var userTarget;
    var updatedJSON;

    // FUNCTIONS
    function displayList(){

        $("#myContainer").empty();

        $.get("http://192.168.1.81:8080/list", function(data){
            for(let i = 0, j = data.length; i < j; i++){

                // CREATE ROW FOR USER INFORMATION
                let userRow = $("<div></div>");
                $(userRow).addClass("userRow");

                // ADD USER INFO
                // $(userRow).append("<span>NAME: </span>" + data[i].userName + "<span> MAIL: </span>" + data[i].eMail + "<span> AGE: </span>" + data[i].age + "<span> ID: </span>" + data[i].id)

                let newSpan1 = $("<span></span>")
                $(newSpan1).text(data[i].userName);
                $(userRow).append(newSpan1);

                let newSpan2 = $("<span></span>")
                $(newSpan2).text(data[i].eMail);
                $(userRow).append(newSpan2);


                let newSpan3 = $("<span></span>")
                $(newSpan3).text(data[i].age);
                $(userRow).append(newSpan3);
                $("#myContainer").append(userRow)

                // ADD MANIPULATION BUTTONS
                $(userRow).append('<button id="' + data[i].id + '" type="button" name="button" onclick="deleteUser()">Delete</button>');
                $(userRow).append('<button id="' + data[i].id + '" type="button" name="button" onclick="updateUser()">Update</button>');
            }
        });
    }

    function displayNew(){
        // CHECKING STATE. FALSE IF NEW USER.
        updateData = false;

        // EMPTY CONTAINER
        $("#myContainer" ).empty();

        // CREATE FORM
        $("#myContainer" ).append('<form id="submitForm" action="index.html" method="post">');
        $("form").append('<div class="row"><input id="userName" type="text" name="userName" value="default Name"><label for="userName">Username</label></div>');
        $("form").append('<div class="row"><input id="userEmail" type="text" name="userEmail" value="default Email"><label for="userEmail">Email</label></div>');
        $("form").append('<div class="row"><input id="userAge" type="number" name="userAge" value="10"><label for="userAge">Age</label></div>');

        // CREATE BUTTON
        $("form").append('<button id="btn-submit" type="button" name="button">Submit</button>');
        $("form").append('<button id="btn-cancel" type="button" name="button">Cancel</button>');
        $("#btn-cancel").click(displayList);
        $("#btn-submit").click(submitJSON);
    }



    function formJSON(){
        let newUserObject = new Object();

        // GET INPUT DATA AND ADD TO OBJECT
        $("#submitForm").find(":input").each(function(){

            if(this.name == "userName"){
                newUserObject.userName = this.value;
            }else if(this.name == "userEmail"){
                newUserObject.eMail = this.value;
            }else if(this.name == "userAge"){
                newUserObject.age = parseInt(this.value);
            }
        })

        if(updateData){
            console.log("ADDING UPDATING ID")
            newUserObject.id = Number(userTargetId);
        }

        // MAKE JSON OBJECT
        var newJSON = JSON.stringify(newUserObject);
        console.log(newJSON);

        // RETURN FORMED JSON
        return(newJSON);
    }

    function submitJSON(){

        let newUser = formJSON();

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

    function deleteUser(){
        let deleteUserId = JSON.stringify({id:Number(event.target.id)});
        console.log(deleteUserId);

        $.ajax({
            type: "POST",
            url: "http://192.168.1.81:8080/delete",
            data: deleteUserId,
            success: function(data){
                console.log(data.error);
                displayList(); /* !!! AJAX IS ASYNCHRONOUS !!! */
            },
            dataType: "json",
            contentType: "application/json"
        });
    }


    function updateUser(){
        updateData = true;
        userTargetId = event.target.id;

        // GET USER DATA BY ID !!! ASYNCHRONOUS !!!
        $.get("http://192.168.1.81:8080/list", function(data){
            for(let i = 0, j = data.length; i < j; i++){
                if(data[i].id == userTargetId){
                    userTarget = data[i];
                    console.log(userTarget);
                    break;
                }
            }
            createForm();
        })

    }


    function createForm(){
        if(!updateData){
            // FOR CREATING NEW USER
            updateData = false;

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
            $("#btn-submit").click(submitJSON);
        }else{
            // EMPTY CONTAINER
            $("#myContainer" ).empty();

            // RECREATE FORM
            $("#myContainer" ).append('<form id="submitForm" action="index.html" method="post">');
            $("form").append('<div class="row"><input id="userName" type="text" name="userName" value=""><label for="userName">Username</label></div>');
            $("#userName").val(userTarget.userName);
            $("form").append('<div class="row"><input id="userEmail" type="text" name="userEmail" value=""><label for="userEmail">Email</label></div>');
            $("#userEmail").val(userTarget.eMail);
            $("form").append('<div class="row"><input id="userAge" type="number" name="userAge" value=""><label for="userAge">Age</label></div>');
            $("#userAge").val(userTarget.age);
            $("form").append('<button id="btn-submit" type="button" name="button">Submit</button>');
            $("form").append('<button id="btn-cancel" type="button" name="button">Cancel</button>');

            // CREATE BUTTONS
            $("#btn-cancel").click(displayList);
            $("#btn-submit").click(submitJSON);
        }
    }
});
