window.targetsOpen = function() {
  fetch('./src/html/targets.html')
      .then(response => {
          if (!response.ok) {
              throw new Error('Реакция сети' + response.statusText);
          }
          return response.text(); 
      })
      .then(html => {
          document.getElementById('content').innerHTML = html;
      })
      .catch(error => {
          console.error('Возникла проблема с операцией выборки:', error);
      });
}

window.targetsTargetsChange = function(elem){
    document.getElementById('targetsExternal').classList.toggle('d-none');
    document.getElementById('targetsInternal').classList.toggle('d-none');
}
