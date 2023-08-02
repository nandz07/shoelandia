
$(document).ready(function () {
  try {
  // jQuery.validator.addMethod("noSpace", function(value, element) {
  //   return value.trim().length != 0 ;
  // }, "No space please and don't leave it empty");
  
  $('#signUpForm').validate({
    rules: {
      name: {
        required: true,
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
      name: {
        required: "Please enter your name"
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
  $('#addressForm').validate({
    rules: {
      name: {
        required: true,
        noSpace:true
      },
      phone: {
        required: true,
        noSpace:true
      },
      email: {
        required: true,
        email: true,
        noSpace:true
      },
      address: {
        required: true,
        noSpace:true
      },
      city: {
        required: true,
        noSpace:true
      },
      state: {
        required: true,
        noSpace:true
      },
      country: {
        required: true,
        noSpace:true
      },
      zip: {
        num:true,
        required: true,
        noSpace:true
      },
    },
    messages: {
      name: 'Please enter your name',
      phone: 'Please enter your phone number',
      email: {
        required: 'Please enter your email',
        email: 'Please enter a valid email address'
      },
      address: 'Please enter your address',
      city: 'Please enter your city',
      state: 'Please enter your state',
      country: 'Please enter your country',
      zip: 'Please enter your ZIP/postal code'
    },
    // submitHandler: function (form, event) {
    //   event.preventDefault();
    //   axios.post(form.action, new FormData(form))
    // }
  });
  $('#contactForm').validate({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 6 // Change this value to set the minimum password length
        }
    },
    messages: {
        email: {
            required: 'Please enter your email address',
            email: 'Please enter a valid email address'
        },
        password: {
            required: 'Please enter your password',
            minlength: 'Password must be at least {0} characters long' // The {0} placeholder will be replaced with the minlength value
        }
    },
   
});
  $("#emailForgotPasswordForm").validate({
    rules: {
      emailForgotPassword: {
        required: true,
        email: true
      },
    },
    messages: {
      emailForgotPassword: {
        required: 'Please enter your email ',
            email: 'Please enter a valid email address'
      },
    },
  });
} catch (error) {
    console.log(error)
}
});

