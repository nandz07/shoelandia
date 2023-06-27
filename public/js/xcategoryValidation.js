
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
        submitHandler: function(form) {
          $.ajax({
              url:"addCategory",
              data:$("#addCategoryForm").serialize(),
              method:"post",
              success:function (response){
                console.log(response);
                $("#modalCenter").modal("hide");
                $("#addCategoryForm")[0].reset();
                  // alert("Form submitted successfully"+response)
                  // console.log(response.message);
                  Swal.fire({
                    position: 'bottom-end',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  // console.log(response.data);
                  // $("#categoryTable").DataTable().ajax.reload();
                  // $("#categoryTable").DataTable().clear().draw(); // Clear the existing table data
                  if (response.response.data && response.response.data.length > 0) {
                    console.log(response.response.data.length);
                    $("#categoryTable").DataTable().rows.add(response.response.data).draw(); // Add the new data
                  }
                 
              },
              error:function (err){
                console.log(err);
                  alert("Something Error")
  
              }
          })
      }
    });
  });
