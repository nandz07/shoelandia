
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

    function remove(id){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/deleteCategory/`,
            data:{
              id:id
            },
            method: "GET",
            success: function (response) {
              // alert("Form submitted successfully");
              // window.location.reload();
              swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
              setTimeout(() => {
                window.location.reload()
              }, 1000);
              
            },
            error: function (err) {
              alert("Something went wrong");
            }
          });
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your file is safe :)',
            'error'
          )
        }
      })
    }