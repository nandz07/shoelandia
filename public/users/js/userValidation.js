
$(document).ready(function () {
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
      name: 'required',
      phone: 'required',
      email: {
        required: true,
        email: true
      },
      address: 'required',
      city: 'required',
      state: 'required',
      country: 'required',
      zip: 'required'
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
});

