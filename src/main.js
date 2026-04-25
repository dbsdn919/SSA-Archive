import './style.css'

const listItems = document.querySelectorAll('.project-list li');
let currentIndex = 0;
let intervalId = null;

function updateActiveItem() {
  listItems.forEach((item, index) => {
    if (index === currentIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function startRolling() {
  if (listItems.length === 0) return;
  intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % listItems.length;
    updateActiveItem();
  }, 5000);
}

function stopRolling() {
  clearInterval(intervalId);
}

// Hover에 따른 정지/재생 제어
listItems.forEach((item, index) => {
  item.addEventListener('mouseenter', () => {
    stopRolling();
    currentIndex = index;
    updateActiveItem();
  });
  item.addEventListener('mouseleave', () => {
    startRolling();
  });
});

// 시작
if (listItems.length > 0) {
  updateActiveItem();
  startRolling();
}
