/*	TL.Media.Image
	Produces image assets.
	Takes a data object and populates a dom object
================================================== */

TL.Media.Image = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this,
			image_class = "tl-media-item tl-media-image tl-media-shadow";
		// Loading Message
		this.loadingMessage();

		if (this.data.url.match(/.png(\?.*)?$/)) {
			image_class = "tl-media-item tl-media-image"
		}

		// Link
		if (this.data.link) {
			this._el.content_link 				= TL.Dom.create("a", "", this._el.content);
			this._el.content_link.href 			= this.data.link;
			this._el.content_link.target 		= "_blank";
			this._el.content_item				= TL.Dom.create("img", image_class, this._el.content_link);
		} else {
			this._el.content_item				= TL.Dom.create("img", image_class, this._el.content);
		}

		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		this._el.content_item.src			= TL.Util.transformImageURL(this.data.url);

		this.onLoaded();
	},

	_updateMediaDisplay: function(layout) {


		if(TL.Browser.firefox) {
			//this._el.content_item.style.maxWidth = (this.options.width/2) - 40 + "px";
			this._el.content_item.style.width = "auto";
		}

	}

});
