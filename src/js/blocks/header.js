
window.updateUserImage = (select) => {
  const userImages = {
    option1: './images/users/question.jpg', 
    option2: './images/users/ZilevichElizaveta.jpg' , 
    option3: './images/users/user1.png', 
    option4: './images/users/TkachevOleg.jpg' , 
    option5: './images/users/user1.png', 
    option6: './images/users/TolokGalina',
    option7: './images/users/user1.png' 
  };
  const value = select.value;
  const navimgUser = document.getElementById('navimg-user');
  if (value && userImages[value]) {
    navimgUser.src = userImages[value];
    navimgUser.style.border= '2px solid #4757de';
  }
}