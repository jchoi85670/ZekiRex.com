// One form, two Buttondown newsletters: Korean (zekirex) and English (zekirex-en).
// The language choice only changes where the form posts.
(function(){
  var lists={ko:'zekirex',en:'zekirex-en'};
  document.querySelectorAll('form[data-subscribe]').forEach(function(form){
    function sync(){
      var picked=form.querySelector('input[name="lang"]:checked');
      var key=picked?picked.value:'ko';
      form.action='https://buttondown.com/api/emails/embed-subscribe/'+lists[key];
    }
    form.querySelectorAll('input[name="lang"]').forEach(function(r){r.addEventListener('change',sync)});
    sync();
  });
})();
