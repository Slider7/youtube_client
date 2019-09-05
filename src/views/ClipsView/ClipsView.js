import EventEmitter from '../../utils/helpers';
import iconEye from '../images/eye.png';
import iconUpload from '../images/cloud-upload.png';
import iconAuthor from '../images/customer-50.png';

export default class ClipsView extends EventEmitter {
  constructor(data, position, count) {
    super();
    this.data = data;
    this.position = position;
    this.count = count;
  }

  render() {
    const cards = this.data.clips.slice(this.position, this.count);
    const result = cards.map((item) => {
      const card = document.createElement('div');
      card.className = 'card';

      const title = document.createElement('h3');
      const link = document.createElement('a');
      link.setAttribute('href', `https://www.youtube.com/watch?v=${item.id}`);
      link.setAttribute('target', '_blank');
      link.innerHTML = item.snippet.title;
      title.appendChild(link);

      const thumbnail = new Image();
      thumbnail.src = item.snippet.thumbnails.medium.url;
      thumbnail.className = 'thumbnail';

      const uploadDate = document.createElement('p');
      const uploadImg = new Image();
      uploadImg.src = iconUpload;
      uploadDate.innerHTML = item.snippet.publishedAt.substr(0, 16).replace('T', ' ');
      uploadDate.appendChild(uploadImg);

      const eyeImg = new Image();
      eyeImg.src = iconEye;
      const viewsCount = document.createElement('p');
      viewsCount.innerHTML = item.statistics.viewCount;
      viewsCount.appendChild(eyeImg);

      const author = document.createElement('p');
      author.className = 'author';
      const authorImg = new Image();
      authorImg.src = iconAuthor;
      author.innerHTML = item.snippet.channelTitle;
      author.appendChild(authorImg);

      const description = document.createElement('p');
      description.className = 'description';
      description.innerHTML = item.snippet.description;

      card.appendChild(title);
      card.appendChild(thumbnail);
      card.appendChild(uploadDate);
      card.appendChild(viewsCount);
      card.appendChild(author);
      card.appendChild(description);

      return card;
    });
    return result;
  }
}
