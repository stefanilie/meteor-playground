Template.tweet.rendered = function() {
  setTimeout(function() {
    twttr.widgets.load(this.firstNode);
  }, 0);
}
