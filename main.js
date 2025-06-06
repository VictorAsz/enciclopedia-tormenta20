jQuery(document).ready(function () {

  // Carrega a página inicial(Home)
  jQuery('#content').load(`/pages/home/home.html`);

  // Carrega a navbar
  jQuery('#navbar-container').load('/componentes/navbar/navbar.html', function () {
   
    //Listener de clique para os links da navbar que vão carregar a página.
      jQuery('.nav-link').on('click', function (e) {
        e.preventDefault();
        const page = jQuery(this).data('page');

        jQuery('#content').load(`/pages/${page}/${page}.html`);
      });

    // Listener de clique para a logo.
      jQuery('.navbar-brand').on('click', function (e) {
        e.preventDefault();
        jQuery('#content').load(`/pages/home/home.html`);
      });

  });


});
