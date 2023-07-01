$(document).ready(function () {
    $("#productForm").validate({
        rules: {
            productName: {
                required: true,
            },
            productDescription: {
                required: true,
                minlength: 4
            },
            productPrice: {
                required: true,
                number: true,
                min: 0
            },
            productStock: {
                required: true,
                number: true,
                min: 0
            },
            productDis: {
                required: true,
                number: true,
                min: 0,
                max: 100
            },
            productCategory: {
                required: true
            }
        },
        messages: {
            productName: {
                required: "Please enter the product name"
            },
            productDescription: {
                required: "Please enter the product description",
                minlength: "At least 4 characters required"
            },
            productPrice: {
                required: "Please enter the product price",
                number: "Please enter a valid number",
                min: "Price cannot be negative"
            },
            productStock: {
                required: "Please enter the product stock",
                number: "Please enter a valid number",
                min: "Stock cannot be negative"
            },
            productDis: {
                required: "Please enter the product discount",
                number: "Please enter a valid number",
                min: "Discount should be between 0 and 100",
                max: "Discount should be between 0 and 100"
            },
            producrtCategory: {
                required: "Please select the product Category",
            },
        },
        submitHandler: function (form) {
            var formData = new FormData(form);
            $.ajax({
                url: "/admin/addproduct",
                data: formData,
                method: "post",
                success: function (response) {

                },
                error: function (err) {
                    console.log(err);
                    alert("Something Error")

                }
            })
        }
    });
    // $("#productUpdateForm").validate({
    //     rules: {
    //         productName: {
    //             required: true,
    //         },
    //         productDescription: {
    //             required: true,
    //             minlength: 4
    //         },
    //         productPrice: {
    //             required: true,
    //             number: true,
    //             min: 0
    //         },
    //         productStock: {
    //             required: true,
    //             number: true,
    //             min: 0
    //         },
    //         productDis: {
    //             required: true,
    //             number: true,
    //             min: 0,
    //             max: 100
    //         },
    //         productCategory: {
    //             required: true
    //         }
    //     },
    //     messages: {
    //         productName: {
    //             required: "Enter the product name please"
    //         },
    //         productDescription: {
    //             required: "Please enter the product description",
    //             minlength: "At least 4 characters required"
    //         },
    //         productPrice: {
    //             required: "Please enter the product price",
    //             number: "Please enter a valid number",
    //             min: "Price cannot be negative"
    //         },
    //         productStock: {
    //             required: "Please enter the product stock",
    //             number: "Please enter a valid number",
    //             min: "Stock cannot be negative"
    //         },
    //         productDis: {
    //             required: "Please enter the product discount",
    //             number: "Please enter a valid number",
    //             min: "Discount should be between 0 and 100",
    //             max: "Discount should be between 0 and 100"
    //         },
    //         producrtCategory: {
    //             required: "Please select the product Category",
    //         },
    //     },
    //     submitHandler: function (form) {
    //         var formData = new FormData(form);
    //         $.ajax({
    //             url: "/admin/editProductDetails/",
    //             data: formData,
    //             method: "post",
    //             success: function (response) {

    //             },
    //             error: function (err) {
    //                 console.log(err);
    //                 alert("Something Error")

    //             }
    //         })
    //     }
    // });
})

// $(document).ready(function() {
//     $("#productForm").validate({
//       rules: {
//         productName: {
//           required: true,
//         },
//         productDescription: {
//           required: true,
//           minlength: 4
//         },
//         "productSize[]": {
//             required: true,
//             minlength: 1
//           },
//         // productSize: {
//         //     required: function(element) {
//         //         alert('hai')
//         //       return $("input[name='productSize[]']:checked").length === 0;
//         //     }
//         //   },
//         producrtCategory: {
//           required: true
//         },
//         productPrice: {
//           required: true,
//           number: true,
//           min: 0
//         },
//         productStock: {
//           required: true,
//           number: true,
//           min: 0
//         },
//         productDis: {
//           required: true,
//           number: true,
//           min: 0,
//           max: 100
//         }
//       },
//       messages: {
//         productName: {
//           required: "Please enter the product name"
//         },
//         productDescription: {
//           required: "Please enter the product description",
//           minlength: "At least 4 characters required"
//         },
//         "productSize[]": {
//             required: "Please select at least one size",
//             minlength: "Please select at least one size"
//           },
//         producrtCategory: "Please select a category",
//         productPrice: {
//           required: "Please enter the product price",
//           number: "Please enter a valid number",
//           min: "Price cannot be negative"
//         },
//         productStock: {
//           required: "Please enter the product stock",
//           number: "Please enter a valid number",
//           min: "Stock cannot be negative"
//         },
//         productDis: {
//           required: "Please enter the product discount",
//           number: "Please enter a valid number",
//           min: "Discount should be between 0 and 100",
//           max: "Discount should be between 0 and 100"
//         }
//       },
//       errorElement: "span",
//       errorPlacement: function(error, element) {
//         error.addClass("invalid-feedback");
//         element.closest(".col-sm-10").append(error);
//       },
//       highlight: function(element, errorClass, validClass) {
//         $(element).addClass("is-invalid").removeClass("is-valid");
//       },
//       unhighlight: function(element, errorClass, validClass) {
//         $(element).removeClass("is-invalid").addClass("is-valid");
//         $(element).closest(".col-sm-10").find(".invalid-feedback").remove();
//       }
//     });
//   });
