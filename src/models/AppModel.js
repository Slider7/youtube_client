export default class AppModel {
  constructor(state) {
    this.state = state;
  }

  static extractIDs(data) {
    return data.items.map(clip => clip.id.videoId);
  }

  async getClipsData() {
    if (!this.state) {
      return null;
    }
    let url = this.state.url1;
    const responce = await fetch(url);
    const data = await responce.json();

    const videoIDs = AppModel.extractIDs(data);
    url = this.state.url2 + videoIDs.join();
    const fullDataResponce = await fetch(url);
    const fullData = await fullDataResponce.json();
    return { clips: fullData.items, token: data.nextPageToken, qry: this.state.qry };
  }
}
