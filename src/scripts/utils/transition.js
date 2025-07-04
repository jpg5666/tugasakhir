export function withViewTransition(callback) {
  if (document.startViewTransition) {
    return document.startViewTransition(callback);
  } else {
    return callback();
  }
}
