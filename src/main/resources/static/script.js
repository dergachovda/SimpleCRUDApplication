$(document).ready(function() {

  $.ajax({
          xhrFields: {
            withCredentials: true
          },
          beforeSend: function() {
            $('body').append('<div class="loader"><img src="img/loading.gif"></div>');
          },
          url: "/users",
          dataType: 'json',
          type: 'GET',
          success: function(data) {
            $("header").show();
            $(".info").append('Total users: ' + data.totalElements + ', Current page: ' + (data.number+1) + ', Total Pages: ' + data.totalPages);
            data.content.forEach(function(item) {
              $(".table").append('<div class="item-user-wrap"> <div class="item-user"> <input type="text" value="' + item.userId + '" class="id-user" readonly> <input type="text" value="'+item.firstName+'" class="firstName-user" readonly> <input type="text" value="'+item.lastName+'" class="lastName-user" readonly> <input type="text" value="'+item.birthDay+'" class="birthDay-user" readonly> <input type="text" value="'+item.gender+'" class="gender-user" readonly> </div> <span class="edit">edit</span><span class="save">save</span><span class="delete">del</span></div>');
            });
          },
          error:function() { 
             alert('Error');
          },
          complete: function(){
            $('.loader').remove();
          }
        });

    // редактирование строки города
    $(".table").on('click', 'span.edit', function() {
        
        $(this).siblings(".item-user").children("input:not(.id-user), textarea").removeAttr("readonly").addClass('active');
        $(this).siblings(".save").addClass('active');
        $(this).hide();

    });

    // сохранение редактирования или добавление нового города в базе
    $(".table").on('click', 'span.save', function() {
          
          var activeSpan = $(this);
          var id = $(this).siblings(".item-user").children("input.id-user").val();
          var firstName = $(this).siblings(".item-user").children("input.ferstName-user").val();
          var lastName = $(this).siblings(".item-user").children("input.lastName-user").val();
          var birthDay = $(this).siblings(".item-user").children("input.birthDay-user").val();
          var gender = $(this).siblings(".item-user").children("input.gender-user").val();

          if (
            ( firstName == "" ) 
            || ( lastName == "" ) 
            || ( birthDay == "" ) 
            || ( gender == "" ) 
          ) {
            alert("Imput data in all fields!");
          }

          if ( $(this).hasClass('add-user') ) {
                //add new user
                $.ajax({
                xhrFields: {
                  withCredentials: true
                },
                url: "/users",
                dataType: 'json',
                type: 'POST',
                data: {
                  "firstName" : firstName,
                  "lastName"  : lastName,
                  "birthDay"  : birthDay,
                  "gender"    : gender
                  },
                success: function(data) {
                  alert(data);
                }
                });

                

            }

            else {

                //edit user
                $.ajax({
                  xhrFields: {
                    withCredentials: true
                  },
                  url: "/users/"+id,
                  dataType: 'json',
                  type: 'PUT',
                  data: {
                    "userId"    : id,
                    "firstName" : firstName,
                    "lastName"  : lastName,
                    "birthDay"  : birthDay,
                    "gender"    : gender  
                    },
                  success: function(data) { 
                    alert(data);
                  }
                });
            }
    });

    //delete user 
    $(".table").on('click', 'span.delete', function() {
      
        var activeSpan = $(this);
        var id = $(this).siblings(".item-user").children("input.id-user").val();

        if ( !$(this).hasClass('new-user') ) {

          if ( confirm("Delete the user?") ) {

            $.ajax({
              xhrFields: {
                withCredentials: true
              },
              url: '/users/' + id,
              dataType: 'json',
              type: 'DELETE',
              success: function(data) {
                alert(data);
              }
            });

          }

        }

        else {

            //delete empty line
             activeSpan.parent().remove();

        } 

 
    });

    //промотка страницы вниз
    function scroll_to_bottom(speed) {
      var height= $("body").height(); 
      $("html,body").animate({"scrollTop":height},speed); 
    }

    // добавление нового города в таблице на странице
    $(".add-user").on('click', function() {

        scroll_to_bottom(500);
        var newUser = $('<div class="item-user-wrap new-user"> <div class="item-user"> <input type="text" value="" class="id-user" readonly> <input type="text" value="" class="firstName-user" readonly> <input type="text" value="" class="lastName-user" readonly> <input type="text" value="" class="birthDay-user" readonly> <input type="text" value="" class="gender-user" readonly> </div> <span class="edit"></span> <span class="save add-user"></span> <span class="delete new-user"></span> </div>');
        $(".table").append(newUser);
        $(".item-user-wrap.new-user .item-user").children("input:not(.id-user), textarea").removeAttr("readonly").addClass('active');
        $(".item-user-wrap.new-user .save").addClass('active');
        $(".item-user-wrap.new-user .edit").hide();

    });

    // функция поиска города в таблице
    function search() {
        
        var object = $('.item-user'); 
        var search = $('#spterm').val().toLowerCase(); 
        var marginTop = $('.header').height();
        var countUser = 0;

        $.each(object, function(){

          var idUser = $(this).children('input.id-user').val().toLowerCase(); 
          var idFirstName = $(this).children('input.firstName-user').val().toLowerCase();
          
          if (( idCity == search ) || ( idFirstName == search )) {

            var height = $(this).children('input.id-user').offset().top - marginTop -5; 
            $("html,body").animate({"scrollTop":height}, 800); 
            countUser += 1;
          }

          return countUser;
        });

        if (countUser == 0) { 
          alert("Город с таким названием или id не найден!");
        }

    }

    // поиск города в таблице при клике на кнопку поиска
    $(".search .button").on('click', function() {
        search();
    });

    // поиск города в таблице при нажатии энтера в поле ввода
    $('input#spterm').keydown(function(e) {
      if(e.keyCode === 13) {
        search();
      }
    });

    // редактирование строки города
    $(".close").on('click', function() {
        
        location.reload();

    });


});