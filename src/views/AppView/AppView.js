import EventEmitter from '../../utils/helpers';
import ClipsView from '../ClipsView/ClipsView';
import SliderView from '../SliderView/SliderView';

export default class AppView extends EventEmitter {
  constructor(data) {
    super();
    this.data = data;
    this.current = 0;
    this.i = 0;
    this.N = 0;
  }

  startSearch(evt) {
    evt.preventDefault();
    const query = document.getElementById('inpSearch').value;
    this.emit('search', query);
  }

  nextSearch(evt) {
    evt.preventDefault();
    if (this.data) {
      const query = this.data.qry;
      const token = this.data.token || null;
      this.emit('nextSearch', query, token);
    }
  }

  render(currScreen) {
    if (currScreen > 0) {
      const clipView = new ClipsView(
        this.data,
        currScreen * 15,
        currScreen * 15 + 15,
      );
      clipView.render().forEach((item) => {
        document.querySelector('.snippets').appendChild(item);
      });
      document
        .querySelector('.snippets')
        .style.setProperty('--n', currScreen * 15 + 15); // ширина контант-дива в экранах
      this.N = Math.trunc(((currScreen + 1) * 15) / 4) + 1;
      return;
    }
    document.body.innerHTML = '';
    const searchDiv = document.createElement('div');
    const searchInput = document.createElement('input');
    const container = document.createElement('div');
    const content = document.createElement('div');
    container.className = 'container';
    content.className = 'snippets';
    const btnSearch = document.createElement('button');
    const hidden = document.createElement('span');
    const author = document.createElement('p');
    author.className = 'author off';
    const authorLink = document.createElement('a');
    authorLink.setAttribute('href', 'https://github.com/Slider7');
    authorLink.setAttribute('target', '_blank');
    authorLink.innerHTML = 'by K. Shlembayev';
    author.appendChild(authorLink);

    const slider = SliderView();

    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('id', 'inpSearch');
    searchInput.setAttribute('placeholder', ' What You want to search?');
    searchInput.className = 'search-input';
    btnSearch.className = 'btn-search';
    btnSearch.innerHTML = 'Search';
    document.body.appendChild(searchDiv);
    document.body.appendChild(hidden);
    searchDiv.className = 'search-container';
    searchDiv.appendChild(searchInput);
    searchDiv.appendChild(btnSearch);

    container.appendChild(content);
    document.body.appendChild(container);
    document.body.appendChild(slider);
    document.body.appendChild(author);

    btnSearch.addEventListener('click', this.startSearch.bind(this));
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btnSearch.click();
      }
    });

    hidden.addEventListener('click', this.nextSearch.bind(this));

    if (this.data) {
      const clipView = new ClipsView(
        this.data,
        currScreen * 15,
        currScreen * 15 + 15,
      );
      clipView.render().forEach((item) => {
        document.querySelector('.snippets').appendChild(item);
      });
      content.style.setProperty('--n', (currScreen + 1) * 15); // ширина контент-дива в карточках
      slider.classList.remove('off');
      author.classList.remove('off');
    }
    /*  --------------------------------------------------------------------------------------  */
    function checkButton(i) {
      if (i > 0) document.getElementById('prev').classList.remove('off');
      else document.getElementById('prev').classList.add('off');
      document.getElementById('current').innerText = i + 1;
      document.querySelectorAll('.tooltip')[1].innerHTML = i + 2;
      document.querySelectorAll('.tooltip')[0].innerHTML = i;
    }

    const slideLeft = (e) => {
      e.preventDefault();
      if (this.i < this.N) {
        this.i += 1;
        document.querySelector('.container').scrollLeft = this.i * this.w;
        checkButton(this.i);
      }
      if (this.i >= this.N - 1) {
        document.querySelector('span').click(); // подгружаем еще клипы ...
      }
    };

    const slideRight = (e) => {
      e.preventDefault();
      if (this.i > 0) {
        this.i -= 1;
        document.querySelector('.container').scrollLeft = this.i * this.w;
        checkButton(this.i);
      }
    };
    let nCard = 4;
    this.N = Math.trunc(content.children.length / nCard) + 1;
    let x0 = null;
    let locked = false;

    function unify(e) {
      return e.changedTouches ? e.changedTouches[0] : e;
    }
    function lock(e) {
      x0 = unify(e).clientX;
      content.classList.toggle('smooth', !(locked = true));
    }

    const size = () => {
      if (window.innerWidth < 300) {
        window.innerWidth = 300;
      }
      this.w = window.innerWidth;
      const oldNCard = nCard;
      nCard = Math.trunc(this.w / 300);
      const { i } = this;
      this.i = Math.round(this.i * (oldNCard / nCard));
      if (i !== this.i) {
        if (oldNCard > nCard) this.i -= oldNCard - nCard;
        else this.i += oldNCard - 1;
      }
      document.querySelector('.container').scrollLeft = this.i * this.w;
      checkButton(this.i);
    };

    size();

    const move = (e) => {
      this.N = Math.trunc(content.children.length / nCard) + 1; // ширина контант-дива в экранах
      if (locked) {
        const dx = unify(e).clientX - x0;
        const s = Math.sign(dx);
        let f = +((s * dx) / this.w).toFixed(2); // порог для сдвига (0,1 экрана)
        if ((this.i > 0 || s < 0) && (this.i < this.N || s > 0) && f > 0.1) {
          this.i -= s;
          container.scrollLeft = this.i * this.w;
        }
        f = 1 - f;
        // начальная позиция сдвига при драге */
        content.style.setProperty('--tx', '0px');
        content.classList.toggle('smooth', (locked = true)); // разблокируем сдвиг и включаем плавность
        x0 = null;
        checkButton(this.i);
      }
      if (this.i >= this.N - 1) {
        hidden.click(); // подгружаем еще клипы ...
      }
    };

    function drag(e) {
      e.preventDefault();
      if (locked) {
        //  визуализация сдвига при драге перед сдвигом
        if (x0 || x0 === 0) {
          content.style.setProperty(
            '--tx',
            `${Math.round((unify(e).clientX - x0) / 2)}px`,
          );
        }
      }
    }

    content.addEventListener('mousedown', lock, false);
    content.addEventListener('touchstart', lock, false);
    content.addEventListener('mouseup', move, false);
    content.addEventListener('touchend', move, false);
    content.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
      },
      false,
    );

    content.addEventListener('mousemove', drag, false);
    content.addEventListener('touchmove', drag, false);

    document
      .getElementById('next')
      .addEventListener('click', slideLeft.bind(this));
    document
      .getElementById('prev')
      .addEventListener('click', slideRight.bind(this));

    document.getElementById('prev').addEventListener('mouseover', () => {
      document.querySelectorAll('.tooltip')[0].classList.remove('off');
    });
    document.getElementById('prev').addEventListener('mouseout', () => {
      document.querySelectorAll('.tooltip')[0].classList.add('off');
    });
    document.getElementById('next').addEventListener('mouseover', () => {
      document.querySelectorAll('.tooltip')[1].classList.remove('off');
    });
    document.getElementById('next').addEventListener('mouseout', () => {
      document.querySelectorAll('.tooltip')[1].classList.add('off');
    });
    window.addEventListener('resize', size, false);
  }
}
