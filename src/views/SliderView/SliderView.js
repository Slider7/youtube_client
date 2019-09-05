export default function SliderView() {
  const slider = document.createElement('div');
  const nextBtn = document.createElement('button');
  const prevBtn = document.createElement('button');
  const currScreen = document.createElement('button');
  const prevHint = document.createElement('span');
  const nextHint = document.createElement('span');

  slider.className = 'slider off';
  nextBtn.className = 'navBtn';
  prevBtn.className = 'navBtn off';
  currScreen.className = 'navBtn';
  prevHint.className = 'tooltip off';
  nextHint.className = 'tooltip off';

  nextBtn.setAttribute('id', 'next');
  currScreen.setAttribute('id', 'current');
  prevBtn.setAttribute('id', 'prev');
  nextBtn.innerText = '>';
  prevBtn.innerText = '<';
  currScreen.innerText = '1';
  nextHint.innerText = '2';

  slider.appendChild(prevHint);
  slider.appendChild(prevBtn);
  slider.appendChild(currScreen);
  slider.appendChild(nextBtn);
  slider.appendChild(nextHint);

  return slider;
}
