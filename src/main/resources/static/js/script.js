const debug = false;
let url = debug ? 'http://localhost:8086' : '';

let currentPage = 0;
let totalPages = 1;
let sizePage = -1;
let users;

$(document).ready(function () {

    const load = (page) => {
        let getUsersUrl = `${url}/users?page=${page}`;
        if (sizePage !== -1) {
            getUsersUrl = `${getUsersUrl}&size=${sizePage}`;
        }
        $.ajax({
            beforeSend: function () {
                $('body').append('<div class="loader"><img src="../img/loading.gif"></div>');
            },
            url: getUsersUrl,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                $("header").show();
                renderInfo(data);
                renderAddUserData();
                $(".tableRow").remove();
                users = data.content;
                users.forEach(function (item) {
                    renderTableRow(item);
                });
                renderPageLinks(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(`Request failed: ${thrownError}`);
            },
            complete: function () {
                $('.loader').remove();
            }
        });
    };

    load(currentPage);

    const renderTableRow = (item) =>
        $(".table").append(
            '<div class="tableRow">' +
            '<div class="id">' + item.userId + '</div>' +
            '<div class="firstName">' + item.firstName + '</div>' +
            '<div class="lastName">' + item.lastName + '</div>' +
            '<div class="birthDay">' + item.birthDay + '</div>' +
            '<div class="gender">' + item.gender + '</div>' +
            '<div class="action">' +
            '<span class="edit"></span>' +
            '<span class="save"></span>' +
            '<span class="delete"></span>' +
            '</div>' +
            '</div>'
        );

    const getGenderSelect = (disabled, id, value) =>
        `<select ${disabled ? "disabled" : ""} id="genderSelect" class="gender"> ` +
        `<option value='' ${!id & "selected"}></option>` +
        `<option value='Female' ${value === 'Female' ? "selected" : ""}>Female</option>` +
        `<option value='Male'  ${value === 'Male' ? "selected" : ""}>Male</option></select>`;


    const getItemData = (curRow) => {
        const id = parseInt(curRow.children('.id').text());
        const firstName = curRow.children('.firstName').children('input').val();
        const lastName = curRow.children('.lastName').children('input').val();
        let birthDay = curRow.children('.birthDay').children('input').val();
        // birthDay = birthDay || $(activeSpan).siblings(".item-user").find("#birthDay").val();
        const gender = curRow.children('.gender').find("#genderSelect option:selected").val();
        return {
            "userId": id,
            "firstName": firstName,
            "lastName": lastName,
            "birthDay": birthDay,
            "gender": gender
        };
    };

    $('.page-links-panel').on('click', 'span.page-link', function () {
        let pageLink = ($(this).text() - 1);
        if (pageLink == null) {
            return;
        }
        console.log("load page:" + pageLink);
        load(pageLink);
    });

    const renderAddUserData = () => {
        $('.addUser').children('.firstName').remove();
        $(".addUser").children('.lastName').remove();
        $(".addUser").children('.birthDay').remove();
        $(".addUser").children('.gender').remove();
        $(".addUser").append(
            '<div class="firstName"><input type="text" value="" placeholder="First name"></div>' +
            '<div class="lastName"><input type="text" value="" placeholder="Last name"></div>' +
            '<div class="birthDay"><input type="date" class="birthDay"></div>' +
            '<div class="gender">' + getGenderSelect() + '</div>'
        );
    };

    const getNewUserData = () => {
        const firstName = $('.addUser').children('.firstName').children('input').val();
        const lastName = $(".addUser").children('.lastName').children('input').val();
        let birthDay = $(".addUser").children('.birthDay').children('input').val();
        // birthDay = birthDay || $(activeSpan).siblings(".item-user").find("#birthDay").val();
        const gender = $(".addUser").children('.gender').find("#genderSelect option:selected").val();
        return {
            "firstName": firstName,
            "lastName": lastName,
            "birthDay": birthDay,
            "gender": gender
        };
    };

    function renderInfo(data) {
        $(".info").remove();
        currentPage = data.number;
        totalPages = data.totalPages;
        sizePage = data.size;
        $(".header").append(
            '<div class="info">' +
            `Show <input type="text" value="${sizePage}" class="size"> of ${data.totalElements} ` +
            '<button type="button" id="applyButton">Apply</button>' +
            '</div>'
        );
    }

    //change page size
    $(".header").on('click', '#applyButton', function () {
        sizePage = $('.size').val();
        load(currentPage);
    });

    // edit user
    $(".table").on('click', 'span.edit', function () {
        let curRow = $(this).parent().parent();
        let id = parseInt(curRow.children('.id').text());
        let curUser = users.find(function (obj) {
            return obj.userId === id;
        });
        curRow.children('.firstName').empty().append(
            `<input type="text" value="${curUser.firstName}">`
        );
        curRow.children('.lastName').empty().append(
            `<input type="text" value="${curUser.lastName}">`
        );
        curRow.children('.birthDay').empty().append(
            `<input type="date" class="birthDay" value="${curUser.birthDay}">`
        );
        curRow.children('.gender').empty().append(
            getGenderSelect(false, 1, curUser.gender)
        );
        $(this).siblings('.save').addClass('active');
        $(this).hide();
        if (debug) {
            console.log('span.edit click');
            console.log('curRow:' + curRow);
            console.log('id:' + id);
            console.log('users:' + users);
            console.log('curUser:' + curUser);
        }
    });

    // save user
    $(".table").on('click', 'span.save', function (textStatus, xhr = null, error = null) {
        let curRow = $(this).parent().parent();
        const user = getItemData(curRow);
        if (user.firstName === "" || user.lastName === "" || user.birthDay === "" || user.gender == "") {
            alert("Please, fill all fields!");
            return;
        }
        $.ajax({
            contentType: "application/json",
            // dataType: 'json',
            url: `${url}/users/${user.userId}`,
            type: 'PUT',
            data: JSON.stringify(user),
            success: function (textStatus, status) {
                load(currentPage);
                console.log(`Edit is ${status}`);
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.responseText);
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            complete: function () {

            }
        });
    });

    //delete user 
    $(".table").on('click', 'span.delete', function () {
        if (debug) {
            console.log('click - span.delete');
        }
        const curRow = $(this).parent().parent();
        const id = parseInt(curRow.children('.id').text());
        if (confirm("Delete the user?")) {
            $.ajax({
                url: `${url}/users/${id}`,
                contentType: "application/json",
                type: 'DELETE',
                success: function (textStatus, status) {
                    console.log(textStatus);
                    console.log(status);
                    load(currentPage);
                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.responseText);
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                }
            });
        }
    });

    // add new user
    $(".header").on('click', '#addButton', function () {
        console.log('add user button click');
        const user = getNewUserData();
        if (user.firstName === "" || user.lastName === "" || user.birthDay === "" || user.gender == "") {
            alert("Please, fill all fields!");
            return;
        }
        $.ajax({
            url: `${url}/users`,
            contentType: "application/json",
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(user),
            success: function(data) {
                load(currentPage);
            },
            error: function(xhr, textStatus, error) {
                console.log(xhr.responseText);
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            }
        });
    });

    const renderPageLinks = (data) => {
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
            } else if (data.number >= (data.totalPages - 10)) {
                $('.page-links-panel').append(`<span class="page-link"><a href="#">1</a></span>`);
                $('.page-links-panel').append(`<span class="page-link">...</span>`);
                for (let i = (data.totalPages - 17); i <= data.totalPages; i++) {
                    if ((i - 1) == data.number) {
                        $('.page-links-panel').append(`<span class="page-link">[${i}]</span>`);
                    } else {
                        $('.page-links-panel').append(`<span class="page-link"><a href="#">${i}</a></span>`);
                    }
                }
            } else {
                $('.page-links-panel').append(`<span class="page-link"><a href="#">1</a></span>`);
                $('.page-links-panel').append(`<span class="page-link">...</span>`);
                for (let i = (data.number - 7); i <= (data.number + 8); i++) {
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

});