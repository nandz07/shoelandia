
$(document).ready(function() {
    $('#categoryTable').DataTable();
      $("#addCategoryForm").validate({
        rules: {
          categoryName: {
            required: true,
          },
          categoryDescription:{
            required: true,
            minlength: 4
          }
          
        },
        messages: {
          categoryName: {
            required: "Please enter the category name",
          },
          categoryDescription: {
            required: "Please enter the category Description ",
            minlength: "At least 4 characters required"
          },
        },
      });
    });
  