$(document).ready(function () {
  $('.nav-link').on('click', function (e) 
  {

    e.preventDefault();


    const page = $(this).data('page');


    $('#content').load(`/aplic/pages/${page}/${page}.html`);
  }
);
});
