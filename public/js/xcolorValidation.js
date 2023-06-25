{/* <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script> */}

$(document).ready(function() {
    $("#addColorForm").validate({
      rules: {
        colorName: {
          required: true,
          minlength: 4
        },
        
      },
      messages: {
        colorName: {
          required: "Please enter the color name",
          minlength: "At least 4 characters required"
        },
        
      },
      submitHandler: function(form) {
        $.ajax({
          url: "addColor",
          data: $("#addColorForm").serialize(),
          method: "post",
          success: function(response) {
            // alert("Form submitted successfully");
            // window.location.reload();
            alert(response.message)
            Swal.fire(
  'Good job!',
  'You clicked the button!',
  'success'
)

          },
          error: function(err) {
            alert("Something went wrong");
          }
        });
      }
    });
  });