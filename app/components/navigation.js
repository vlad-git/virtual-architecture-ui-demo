import Component from '@ember/component';

export default Component.extend({
  actions: {
    aboutVisualize() {
      this.parentView.send('flyOut');
    },

    featureVisualize() {
      this.parentView.send('flyIn');
    }
  }
});
