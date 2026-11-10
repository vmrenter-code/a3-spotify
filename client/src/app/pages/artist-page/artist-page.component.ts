import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistData } from '../../data/artist-data';
import { TrackData } from '../../data/track-data';
import { AlbumData } from '../../data/album-data';
import { SpotifyService } from '../../services/spotify.service';

@Component({
    selector: 'app-artist-page',
    templateUrl: './artist-page.component.html',
    styleUrls: ['./artist-page.component.css'],
    standalone: false
})
export class ArtistPageComponent implements OnInit {
	artistId:string;
	artist:ArtistData;
	topTracks:TrackData[];
	albums:AlbumData[];

  constructor(private route: ActivatedRoute, private spotifyService:SpotifyService) { }

  ngOnInit() {
    this.artistId = this.route.snapshot.paramMap.get('id');

    //The three requests don't depend on each other, so send them all at once.
    //Arrow functions keep "this" pointing at the component inside each callback.
    this.spotifyService.getArtist(this.artistId).then((artist) => {
      this.artist = artist;
    });
    this.spotifyService.getTopTracksForArtist(this.artistId).then((tracks) => {
      this.topTracks = tracks;
    });
    this.spotifyService.getAlbumsForArtist(this.artistId).then((albums) => {
      this.albums = albums;
    });
  }

}