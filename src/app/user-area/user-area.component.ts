import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, AfterContentInit } from '@angular/core';
import { Store} from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { window } from '@angular/platform-browser/src/facade/browser';
// import { NgClass } from '@angular/common';
import { YoutubePlayerService } from '../core/services/youtube-player.service';
import { NowPlaylistService } from '../core/services/now-playlist.service';
import { UserManager } from '../core/services/user-manager.service';
import { user } from '../core/store/user-manager';
import { EchoesState } from '../core/store';

@Component({
	selector: 'user-area.user-area',
	template: require('./user-area.html'),
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserArea implements AfterContentInit {
	playlists: Observable<GoogleApiYouTubePlaylistResource[]>;

	constructor(
		public youtubePlayer: YoutubePlayerService,
		private nowPlaylistService: NowPlaylistService,
		private userManager: UserManager,
		public store: Store<EchoesState>) {
		this.playlists = this.store.select(state => state.user.playlists);
	}

	ngAfterContentInit() {
		this.userManager.api$.subscribe(value => {
			// this.userManager.attachSignIn();
			console.log('user',value)
		});
		// let timeoutId = window.setTimeout(() => {
		// 	this.userManager.authAndSignIn();
		// 	window.clearTimeout(timeoutId);
		// }, 1000);
	}

	isSignIn () {
		return this.userManager.isSignIn();
	}

	getPlaylists () {
		this.userManager.getPlaylists();
	}

	playSelectedPlaylist (media: GoogleApiYouTubePlaylistResource) {
		this.userManager.fetchPlaylistItems(media.id)
			.then(response => {
				this.nowPlaylistService.queueVideos(response.items);
				this.youtubePlayer.playVideo(response.items[0]);
			});
		// this.youtubePlayer.playVideo(media);
		// this.queueSelectedVideo(media);
		// this.nowPlaylistService.updateIndexByMedia(media);
	}

	queueSelectedPlaylist (media: GoogleApiYouTubePlaylistResource) {
		// this.nowPlaylistService.queueVideo(media);
	}
}
