// 星战风格开场动画
function showStarWarsIntro(text, onEnd) {
  if(document.getElementById('starwars-bg')) return;
  const bg = document.createElement('div');
  bg.className = 'starwars-bg';
  bg.id = 'starwars-bg';
  bg.innerHTML = `
    <div class='starwars-intro'>
      <div class='starwars-crawl'>${text.replace(/\n/g,'<br>')}</div>
    </div>
  `;
  document.body.appendChild(bg);
  setTimeout(() => {
    bg.style.transition = 'opacity 1s';
    bg.style.opacity = 0;
    setTimeout(() => {
      bg.remove();
      if(onEnd) onEnd();
    }, 1000);
  }, 18000);
}
