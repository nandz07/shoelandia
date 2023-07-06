
  $(document).ready(function() {
    $('#signUpForm').validate({
      rules: {
        name:{
          required:true,
        },
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 6
        },
        confirm_password: {
          required: true,
          equalTo: "#password"
        }
      },
      messages: {
        name:{
          required:"Please enter your name"
        },
        email: {
          required: "Please enter your email",
          email: "Please enter a valid email address"
        },
        password: {
          required: "Please enter your password",
          minlength: "Your password must be at least 6 characters long"
        },
        confirm_password: {
          required: "Please confirm your password",
          equalTo: "Passwords do not match anymore"
        }
      },
    });
  });

