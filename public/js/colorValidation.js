$(document).ready(function() {
    // $("form").submit(function(event) {
    //   event.preventDefault(); // Prevent the form from submitting

    //   // Validate the colorName field
    //   var colorName = $("#colorName").val().trim();
    //   if (colorName === "") {
    //     alert("Please enter a color name.");
    //     return;
    //   }

    //   // Validate the colorDescription field
    //   var colorDescription = $("#colorDescription").val().trim();
    //   if (colorDescription === "") {
    //     alert("Please enter a color description.");
    //     return;
    //   }

    //   // If all fields are valid, you can submit the form
    //   this.submit();
    // });
    $("#addColorForm").validate({
      rules: {
        colorName: {
          required: true,
        },
        colorDescription:{
          required: true,
          minlength: 4
        }
        
      },
      messages: {
        colorName: {
          required: "Please enter the color name",
          minlength: "At least 4 characters required"
        },
        colorDescription: {
          required: "Please enter the color Description ",
          minlength: "At least 4 characters required"
        },
        
      }
    });
  });