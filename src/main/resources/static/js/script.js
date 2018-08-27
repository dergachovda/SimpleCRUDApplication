const debug = true;
let url = debug ? 'http://localhost:8086' : '';

let currentPage = 0;
let totalPages = 1;
let sizePage = -1;

$(document).ready(function() {
    load(currentPage);

    function load(page) {
        let getUsersUrl = `${url}/users?page=${page}`;
        if (sizePage !== -1) {
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
                    renderItem(item);
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

    const renderItem = (item) => 
        $(".table-data").append('<div class="item-user-wrap"> <div class="item-user"> '+
        '<input type="text" value="' + item.userId + '" class="id-user" readonly> <input type="text" value="' +
        item.firstName + 
        '" class="firstName-user" readonly> <input type="text" value="' +
        item.lastName + '" class="lastName-user" readonly> <input type="text" value="' + item.birthDay +
        '" class="birthDay-user" readonly> ' +getGenderSelect(true, item.userId, item.gender) +
        ' </div> <span class="edit"></span><span class="save"></span><span class="delete"></span></div>');
    

    const getGenderSelect = (disabled, id, value) => 
        `<select ${disabled ? "disabled" : ""} id="genderSelect"> `+
        `<option value='' ${!id & "selected"}></option>`+
        `<option value='Female' ${value==='Female' ? "selected" : ""}>Female</option>`+
        `<option value='Male'  ${value==='Male' ? "selected" : ""}>Male</option></select>`;
    

    const refreshPageLinks = (data) => {
        $('.page-links').remove();
        $('.page-links-panel').append(`<div class="page-links"></div>`);
        for (let i = 1; i <= data.totalPages; i++) {
            if ((i-1) == data.number) {
                $('.page-links').append(`<span class="page-link">[${i}]</B></span>`);
            } else {
                $('.page-links').append(`<span class="page-link"><a href="#">${i}</a></span>`);
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
        $(this).siblings(".item-user").find("#genderSelect").removeAttr("disabled");
        $(this).hide();
    });

    // save or add new user
    $(".table").on('click', 'span.save', function (textStatus, xhr = null, error = null) {
        const activeSpan = $(this);
        const id = $(this).siblings(".item-user").children("input.id-user").val();
        const firstName = $(this).siblings(".item-user").children("input.firstName-user").val();
        const lastName = $(this).siblings(".item-user").children("input.lastName-user").val();
        const birthDay = $(this).siblings(".item-user").children("input.birthDay-user").val();
        const gender = $(this).siblings(".item-user").find("#genderSelect option:selected").val();
        const user = {
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
            alert("Please, fill all fields!");
        }
        let dataObject = {"firstName":user.firstName,"lastName":user.lastName,"birthDay":user.birthDay,"gender":user.gender};
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
                    activeSpan.siblings(".item-user").find("#genderSelect").attr('disabled', 'true');
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
                complete: load(currentPage)
            });
        }
    });

    //delete user 
    $(".table").on('click', 'span.delete', function() {
        let activeSpan = $(this);
        let id = $(this).siblings(".item-user").children("input.id-user").val();
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
        let height = $("body").height();
        $("html,body").animate({"scrollTop": height}, speed);
    }

    // add new user
    $(".add-user").on('click', function () {
        scroll_to_bottom(500);

        const newUser = $('<div class="item-user-wrap new-user"> <div class="item-user">'+
        '<input type="text" value="" class="id-user" readonly>'+
        '<input type="text" value="" class="firstName-user" readonly>'+
        '<input type="text" value="" class="lastName-user" readonly>'+
        '<input type="text" value="" class="birthDay-user" readonly>'+
        getGenderSelect() +
        '</div> <span class="edit"></span> <span class="save add-user"></span> <span class="delete new-user"></span> </div>');
        $(".table-data").append(newUser);
        $(".item-user-wrap.new-user .item-user").children("input:not(.id-user), textarea").removeAttr("readonly").addClass('active');
        $(".item-user-wrap.new-user .save").addClass('active');
        $(".item-user-wrap.new-user .edit").hide();

    });

});