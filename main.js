jQuery(document).ready(function () {
  // Carrega a navbar como componente
  jQuery('#navbar-container').load('/componentes/navbar/navbar.html', function () {
    // Depois que a navbar for carregada, associa os eventos
    jQuery('.nav-link').on('click', function (e) {
      e.preventDefault();
      const page = jQuery(this).data('page');
      jQuery('#content').load(`/pages/${page}/${page}.html`);
    });

    jQuery('.navbar-brand').on('click', function (e) {
      e.preventDefault();
      jQuery('#content').load(`/pages/home/home.html`);
    });
  });

  // Carrega a home automaticamente
  jQuery('#content').load(`/pages/home/home.html`);
});
