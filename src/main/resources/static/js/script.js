const debug = true;
let url = debug ? 'http://localhost:8086' : '';
$(document).ready(function() {
    $.ajax({
            beforeSend: function () {
                $('body').append('<div class="loader"><img src="../img/loading.gif"></div>');
            },
            url: `${url}/users`,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                $("header").show();
                $(".info").append('Total users: ' + data.totalElements + ', Current page: ' + (data.number + 1) + ', Total Pages: ' + data.totalPages);
                data.content.forEach(function (item) {
                    $(".table").append('<div class="item-user-wrap"> <div class="item-user"> <input type="text" value="' + item.userId + '" class="id-user" readonly> <input type="text" value="' + item.firstName + '" class="firstName-user" readonly> <input type="text" value="' + item.lastName + '" class="lastName-user" readonly> <input type="text" value="' + item.birthDay + '" class="birthDay-user" readonly> <input type="text" value="' + item.gender + '" class="gender-user" readonly> </div> <span class="edit"></span><span class="save"></span><span class="delete"></span></div>');
                });
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(`Request failed: ${thrownError}` );
            },
            complete: function () {
                $('.loader').remove();
            }
        });

    // edit user
    $(".table").on('click', 'span.edit', function () {
        $(this).siblings(".item-user").children("input:not(.id-user), textarea").removeAttr("readonly").addClass('active');
        $(this).siblings(".save").addClass('active');
        $(this).hide();
    });

    // save or add new user
    $(".table").on('click', 'span.save', function (textStatus, xhr = null, error = null) {
        var activeSpan = $(this);
        var id = $(this).siblings(".item-user").children("input.id-user").val();
        var firstName = $(this).siblings(".item-user").children("input.firstName-user").val();
        var lastName = $(this).siblings(".item-user").children("input.lastName-user").val();
        var birthDay = $(this).siblings(".item-user").children("input.birthDay-user").val();
        var gender = $(this).siblings(".item-user").children("input.gender-user").val();
        var user = {
            "userId" : id,
            "firstName": firstName,
            "lastName": lastName,
            "birthDay": birthDay,
            "gender": gender
        };
        if (
            (firstName == "")
            || (lastName == "")
            || (birthDay == "")
            || (gender == "")
        ) {
            alert("Input data in all fields!");
        }
        var dataObject = {"firstName":user.firstName,"lastName":user.lastName,"birthDay":user.birthDay,"gender":user.gender};
        if ($(this).hasClass('add-user')) {
            //add new user
            $.ajax({
                url: `${url}/users`,
                contentType: "application/json",
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify(dataObject),
                success: function(data) {
                    activeSpan.siblings(".item-user").children("input:not(.id-user), textarea").removeAttr("readonly").removeClass('active');
                    activeSpan.siblings(".edit").show();
                    activeSpan.removeClass('active add-user');
                    activeSpan.siblings("span.delete").removeClass('new-user');
                    activeSpan.parent().removeClass('new-user');
                    activeSpan.siblings(".item-user").children("input.id-user").val(data.userId);
                },
                error: function(xhr, textStatus, error) {
                    console.log(xhr.responseText);
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                }
            });
        } else {
            //edit user
            $.ajax({
                contentType: "application/json",
                // dataType: 'json',
                url: `${url}/users/${id}`,
                type: 'PUT',
                data: JSON.stringify(dataObject),
                success: function(textStatus, status) {
                    activeSpan.siblings(".item-user").children("input:not(.id-user), textarea").removeAttr("readonly").removeClass('active');
                    activeSpan.siblings(".edit").show();
                    activeSpan.removeClass('active');
                    console.log(textStatus);
                    console.log(status);
                },
                error: function(xhr, textStatus, error) {
                    console.log(xhr.responseText);
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                },
                complete: location.reload()
            });
        }
    });

    //delete user 
    $(".table").on('click', 'span.delete', function() {
        var activeSpan = $(this);
        var id = $(this).siblings(".item-user").children("input.id-user").val();
        if (!$(this).hasClass('new-user')) {
            if (confirm("Delete the user?")) {
                $.ajax({
                    url: `${url}/users/${id}`,
                    contentType: "application/json",
                    type: 'DELETE',
                    success: function(textStatus, status) {
                        console.log(textStatus);
                        console.log(status);
                        location.reload();
                    },
                    error: function(xhr, textStatus, error) {
                        console.log(xhr.responseText);
                        console.log(xhr.statusText);
                        console.log(textStatus);
                        console.log(error);
                    }
                });
            }
        } else {
            //delete empty line
            activeSpan.parent().remove();
        }
    });

    //scroll down
    function scroll_to_bottom(speed) {
        var height = $("body").height();
        $("html,body").animate({"scrollTop": height}, speed);
    }

    // add new user
    $(".add-user").on('click', function () {

        scroll_to_bottom(500);
        var newUser = $('<div class="item-user-wrap new-user"> <div class="item-user"> <input type="text" value="" class="id-user" readonly> <input type="text" value="" class="firstName-user" readonly> <input type="text" value="" class="lastName-user" readonly> <input type="text" value="" class="birthDay-user" readonly> <input type="text" value="" class="gender-user" readonly> </div> <span class="edit"></span> <span class="save add-user"></span> <span class="delete new-user"></span> </div>');
        $(".table").append(newUser);
        $(".item-user-wrap.new-user .item-user").children("input:not(.id-user), textarea").removeAttr("readonly").addClass('active');
        $(".item-user-wrap.new-user .save").addClass('active');
        $(".item-user-wrap.new-user .edit").hide();

    });

    // search a user
    function search() {

        var object = $('.item-user');
        var search = $('#spterm').val().toLowerCase();
        var marginTop = $('.header').height();
        var countUser = 0;

        $.each(object, function () {

            var idUser = $(this).children('input.id-user').val().toLowerCase();
            var idFirstName = $(this).children('input.firstName-user').val().toLowerCase();

            if ((idCity == search) || (idFirstName == search)) {

                var height = $(this).children('input.id-user').offset().top - marginTop - 5;
                $("html,body").animate({"scrollTop": height}, 800);
                countUser += 1;
            }

            return countUser;
        });

        if (countUser == 0) {
            alert("User not found");
        }

    }

    // search a user by button
    $(".search .button").on('click', function () {
        search();
    });

    // search a user by enter
    $('input#spterm').keydown(function (e) {
        if (e.keyCode === 13) {
            search();
        }
    });

    // edit user line
    $(".close").on('click', function () {
        location.reload();
    });

});