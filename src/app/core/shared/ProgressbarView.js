import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import Template from 'core/shared/Progressbar.hbs';

export default class Progressbar extends Backbone.View {

  constructor(options) {
    options = Object.assign(options || {}, {});
    super(options);
  }

  initialize() {
    console.log('Progressbar.initialize');

    this.template = Template;
  }

  update() {
    this.chapterProgress = this.model.getChaptersProgress();

    let userTotal = 0;
    let globalTotal = 0;

    for (let i = 0; i < this.chapterProgress.length; ++i) {
      let chapterP = this.chapterProgress[i];

      chapterP.user *= 100;
      chapterP.local = (chapterP.user * chapterP.global);

      userTotal += chapterP.local;
      globalTotal += chapterP.global * 100;

      chapterP.userTotal = userTotal;
      chapterP.globalTotal = globalTotal;
      chapterP.user = chapterP.user.toFixed(0);
    }
  }

  render() {
    console.log('Progressbar.render');

    this.update();
    this.$el.html(this.template(this));
    this.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });

    return this;
  }
}
