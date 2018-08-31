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
                refreshInfo(data);
                //$(".table").append(`<div class="table-data"></div>`);
                $(".item-user-wrap").remove();
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
        $(".body-table").append('<div class="item-user-wrap"> <div class="item-user"> '+
        '<input type="text" value="' + item.userId + '" class="id-user" readonly> <input type="text" value="' +
        item.firstName + 
        '" class="firstName-user" readonly> <input type="text" value="' +
        item.lastName + '" class="lastName-user" readonly> <input type="date" id="birthDay" value="' + item.birthDay +
        '" class="birthDay-user" readonly> ' + getGenderSelect(true, item.userId, item.gender) +
        ' </div> <span class="edit"></span><span class="save"></span><span class="delete"></span></div>');
    

    const getGenderSelect = (disabled, id, value) => 
        `<select ${disabled ? "disabled" : ""} id="genderSelect"> `+
        `<option value='' ${!id & "selected"}></option>`+
        `<option value='Female' ${value==='Female' ? "selected" : ""}>Female</option>`+
        `<option value='Male'  ${value==='Male' ? "selected" : ""}>Male</option></select>`;
    

    const refreshPageLinks = (data) => {
        $('.page-link').remove();
        if (data.totalPages <= 20) {
            for (let i = 1; i <= data.totalPages; i++) {
                if ((i - 1) == data.number) {
                    $('.page-links-panel').append(`<span class="page-link">[${i}]</span>`);
                } else {
                    $('.page-links-panel').append(`<span class="page-link"><a href="#">${i}</a></span>`);
                }
            }
        } else {
            if (data.number <= 9) {
                for (let i = 1; i <= 18; i++) {
                    if ((i - 1) == data.number) {
                        $('.page-links-panel').append(`<span class="page-link">[${i}]</span>`);
                    } else {
                        $('.page-links-panel').append(`<span class="page-link"><a href="#">${i}</a></span>`);
                    }
                }
                $('.page-links-panel').append(`<span class="page-link">...</span>`);
                $('.page-links-panel').append(`<span class="page-link"><a href="#">${(data.totalPages)}</a></span>`);
            } else if (data.number >= (data.totalPages-10)) {
                $('.page-links-panel').append(`<span class="page-link"><a href="#">1</a></span>`);
                $('.page-links-panel').append(`<span class="page-link">...</span>`);
                for (let i = (data.totalPages-17); i <= data.totalPages; i++) {
                    if ((i - 1) == data.number) {
                        $('.page-links-panel').append(`<span class="page-link">[${i}]</span>`);
                    } else {
                        $('.page-links-panel').append(`<span class="page-link"><a href="#">${i}</a></span>`);
                    }
                }
            } else {
                $('.page-links-panel').append(`<span class="page-link"><a href="#">1</a></span>`);
                $('.page-links-panel').append(`<span class="page-link">...</span>`);
                for (let i = (data.number-7); i <= (data.number+8); i++) {
                    if ((i - 1) == data.number) {
                        $('.page-links-panel').append(`<span class="page-link">[${i}]</span>`);
                    } else {
                        $('.page-links-panel').append(`<span class="page-link"><a href="#">${i}</a></span>`);
                    }
                }
                $('.page-links-panel').append(`<span class="page-link">...</span>`);
                $('.page-links-panel').append(`<span class="page-link"><a href="#">${(data.totalPages)}</a></span>`);
            }
        }
    };

    const getItemData = (activeSpan) => {
        const id = $(activeSpan).siblings(".item-user").children("input.id-user").val();
        const firstName = $(activeSpan).siblings(".item-user").children("input.firstName-user").val();
        const lastName = $(activeSpan).siblings(".item-user").children("input.lastName-user").val();
        let birthDay = $(activeSpan).siblings(".item-user").children("input.birthDay-user").val();
        birthDay = birthDay || $(activeSpan).siblings(".item-user").find("#birthDay").val();
        const gender = $(activeSpan).siblings(".item-user").find("#genderSelect option:selected").val();
        return {
            "userId" : id,
            "firstName": firstName,
            "lastName": lastName,
            "birthDay": birthDay,
            "gender": gender
        };
    };

    $('.page-links-panel').on('click', 'span.page-link', function() {
        let pageLink = ($(this).text() - 1);
        if (pageLink == null) {
            return;
        }
        console.log("load page:" + pageLink);
        load(pageLink);
    });

    function refreshInfo(data) {
        currentPage = data.number;
        totalPages = data.totalPages;
        sizePage = data.size;
        $(".header").append(`<div class="header-item info-data">Total users: ${data.totalElements}, Current page: ${(currentPage+1)}, Total Pages: ${totalPages}</div><div class="header-item info-data">Size <input type="text" value="${sizePage}" class="size"> <button type="button" id="applyButton">Apply</button></div>`);
    }

    //change page size
    $(".header").on('click', '#applyButton', function () {
        sizePage =  $('.size').val();
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
        const user = getItemData(this);

        if (user.firstName === "" || user.lastName === "" || user.birthDay === "" || user.gender == "") {
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
                    load(currentPage);
                },
                error: function(xhr, textStatus, error) {
                    console.log(xhr.responseText);
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                    load(currentPage);
                }
            });
        } else {
            //edit user
            $.ajax({
                contentType: "application/json",
                // dataType: 'json',
                url: `${url}/users/${user.userId}`,
                type: 'PUT',
                data: JSON.stringify(dataObject),
                success: function(textStatus, status) {
                    activeSpan.siblings(".item-user").children("input:not(.id-user), textarea").removeAttr("readonly").removeClass('active');
                    activeSpan.siblings(".edit").show();
                    activeSpan.removeClass('active');
                    console.log(`Edit is ${status}`);
                    load(currentPage);
                },
                error: function(xhr, textStatus, error) {
                    console.log(xhr.responseText);
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                    load(currentPage);
                }
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
    $(".add-user").on('click', '#addButton', function () {
        scroll_to_bottom(500);

        const newUser = $('<div class="item-user-wrap new-user"> <div class="item-user">'+
        '<input type="text" value="" class="id-user" readonly>'+
        '<input type="text" value="" class="firstName-user" readonly>'+
        '<input type="text" value="" class="lastName-user" readonly>'+
        //'<input type="text" value="" class="birthDay-user" readonly>'+
        '<input type="date" id="birthDay" readonly>'+
        getGenderSelect() +
        '</div> <span class="edit"></span> <span class="save add-user"></span> <span class="delete new-user"></span> </div>');
        $(".table-data").append(newUser);
        $(".item-user-wrap.new-user .item-user").children("input:not(.id-user), textarea").removeAttr("readonly").addClass('active');
        $(".item-user-wrap.new-user .save").addClass('active');
        $(".item-user-wrap.new-user .edit").hide();

    });

});