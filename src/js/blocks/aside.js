window.asideToogle = function(){
  const aside = document.getElementById('aside');
  const main = document.getElementById('content');
  aside.classList.toggle('aside--hidden');
  aside.classList.toggle('col-3');
  main.classList.toggle('col-9');
  main.classList.toggle('flex-grow-1');
}

window.tabChange = function(elem){
  const nav = document.getElementById('nav');
  for (const tab of nav.querySelectorAll('.nav-item--active')){
    tab.classList.remove('nav-item--active');
  }
  elem.classList.add('nav-item--active');
  if (elem.closest('.aside-nav__item--collapse')){
    elem.closest('.aside-nav__item--collapse').previousElementSibling.classList.add('nav-item--active');
  }
}