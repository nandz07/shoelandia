$(document).ready(function() {
    $("#addSizeForm").validate({
      rules: {
        newSize: {
          required: true,
        }
      },
      messages: {
        newSize: {
          required: "Please enter the valid size"
        }
      }
    });
  });