import AppModel from '../models/AppModel';
import AppView from '../views/AppView';

const APIKEY = '###';

export default class App {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.state = null;
    this.currScreen = 0;
  }

  async searchClips(query, token) {
    const urlBase = 'https://www.googleapis.com/youtube/v3/search?';
    let urlSettings = `fields=nextPageToken,items/id/videoId&part=snippet&key=${APIKEY}&type=video&maxResults=16&q=${query}`;
    if (token) urlSettings += `&pageToken=${token}`;
    this.state = {
      url1: urlBase + urlSettings,
      url2: `https://www.googleapis.com/youtube/v3/videos?fields=items(id,snippet(publishedAt,title,description,thumbnails/medium,channelTitle),statistics/viewCount)&part=snippet,statistics&key=${APIKEY}&id=`,
      qry: query,
    };
    this.model.state = this.state;
    const data = await this.model.getClipsData();
    if (token) {
      data.clips = this.view.data.clips.concat(data.clips);
      this.currScreen = this.currScreen + 1;
      this.view.data = data;
      this.view.currScreen = this.currScreen;
      this.view.render(this.currScreen);
    } else {
      this.currScreen = 0;
      this.view = new AppView(data);
      this.view.render(this.currScreen);
      this.view.on('search', this.searchClips.bind(this));
      this.view.on('nextSearch', this.searchClips.bind(this));
    }
  }

  async start() {
    this.model = new AppModel(this.state);
    const data = await this.model.getClipsData();
    this.view = new AppView(data);
    this.view.render();
    this.view.on('search', this.searchClips.bind(this));
    this.view.on('nextSearch', this.searchClips.bind(this));
  }
}
