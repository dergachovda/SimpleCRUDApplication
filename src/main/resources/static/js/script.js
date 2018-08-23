const debug = true;
let url = debug ? 'http://localhost:8086' : '';

let currentPage = 0;
let totalPages = 1;
let sizePage = -1;

$(document).ready(function() {
    load(currentPage);

    function load(page) {
        let getUsersUrl = `${url}/users?page=${page}`;
        if (sizePage != -1) {
            getUsersUrl = `${getUsersUrl}&size=${sizePage}`;
        }
        $.ajax({
            beforeSend: function () {
                $('body').append('<div class="loader"><img src="../static/img/loading.gif"></div>');
            },
            url: getUsersUrl,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                $("header").show();
                $(".info-data").remove();
                $(".table-data").remove();
                refreshInfo(data);
                $(".table").append(`<div class="table-data"></div>`);
                data.content.forEach(function (item) {
                    $(".table-data").append('<div class="item-user-wrap"> <div class="item-user"> <input type="text" value="' + item.userId + '" class="id-user" readonly> <input type="text" value="' + item.firstName + '" class="firstName-user" readonly> <input type="text" value="' + item.lastName + '" class="lastName-user" readonly> <input type="text" value="' + item.birthDay + '" class="birthDay-user" readonly> <input type="text" value="' + item.gender + '" class="gender-user" readonly> </div> <span class="edit"></span><span class="save"></span><span class="delete"></span></div>');
                });
                refreshPageLinks(data);
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(`Request failed: ${thrownError}` );
            },
            complete: function () {
                $('.loader').remove();
            }
        });
    }

    function refreshPageLinks(data) {
        $('.page-links').remove();
        $('.page-links-panel').append(`<div class="page-links"></div>`);
        for (var i = 1; i <= data.totalPages; i++) {
            if ((i-1) == data.number) {
                $('.page-links').append(`<span class="page-link">[${i}]</B></span>`);
            } else {
                $('.page-links').append(`<span class="page-link">${i}</span>`);
            }
        }
    }

    $('.page-links-panel').on('click', 'span.page-link', function() {
        console.log("load page:" + ($(this).text() - 1));
        load( ($(this).text() - 1) );
    });

    function refreshInfo(data) {
        currentPage = data.number;
        totalPages = data.totalPages;
        sizePage = data.size;
        $(".info").append(`<div class="info-data">Total users: ${data.totalElements}, Current page: ${(currentPage+1)}, Total Pages: ${totalPages}</br>Size <input type="text" value="${sizePage}" class="size"> <button type="button" id="applyButton">Apply</button> <button type="button" id="prevPageButton">Prev page</button> <button type="button" id="nextPageButton">Next page</button></div>`);
        if (currentPage > 0) {
            $("#prevPageButton").show();
        } else {
            $("#prevPageButton").hide();
        }
        if (currentPage < (totalPages-1)) {
            $("#nextPageButton").show();
        } else {
            $("#nextPageButton").hide();
        }
    }

    //change page size
    $(".info").on('click', '#applyButton', function () {
        sizePage =  $('.size').val();
        load(currentPage);
    });

    //next page
    $(".info").on('click', '#nextPageButton', function () {
        currentPage++;
        if (currentPage > (totalPages-1)) {
            currentPage--;
        }
        load(currentPage);
    });

    //prev page
    $(".info").on('click', '#prevPageButton', function () {
        currentPage--;
        if (currentPage < 0) {
            currentPage++;
        }
        load(currentPage);
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
                        load(currentPage);
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
        $(".table-data").append(newUser);
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


    $(".close").on('click', function () {
        location.reload();
    });

});