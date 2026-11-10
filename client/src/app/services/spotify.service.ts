import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //Combine the Express base URL with the endpoint being requested.
    var uri:string = this.expressBaseUrl + endpoint;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //Encode the search text so spaces and symbols stay within one URL segment.
    return this.sendRequestToExpress('/search/' + category + '/' + encodeURIComponent(resource)).then((data) => {
      //Results are nested under the plural category, e.g. data.artists.items.
      const items = data[category + 's'].items;

      //Build the resource type which matches what was searched for.
      switch(category) {
        case 'artist':
          return items.map((item) => new ArtistData(item));
        case 'album':
          return items.map((item) => new AlbumData(item));
        case 'track':
          return items.map((item) => new TrackData(item));
        default:
          return [];
      }
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    return this.sendRequestToExpress('/artist/' + encodeURIComponent(artistId)).then((data) => {
      return new ArtistData(data);
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //This endpoint wraps its results in a "tracks" array.
    return this.sendRequestToExpress('/artist-top-tracks/' + encodeURIComponent(artistId)).then((data) => {
      return data.tracks.map((track) => new TrackData(track));
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //This endpoint wraps its results in an "items" array.
    return this.sendRequestToExpress('/artist-albums/' + encodeURIComponent(artistId)).then((data) => {
      return data.items.map((album) => new AlbumData(album));
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    return this.sendRequestToExpress('/album/' + encodeURIComponent(albumId)).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //This endpoint wraps its results in an "items" array.
    return this.sendRequestToExpress('/album-tracks/' + encodeURIComponent(albumId)).then((data) => {
      return data.items.map((track) => new TrackData(track));
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    return this.sendRequestToExpress('/track/' + encodeURIComponent(trackId)).then((data) => {
      return new TrackData(data);
    });
  }
}