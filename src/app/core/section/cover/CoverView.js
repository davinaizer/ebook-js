import Backbone from 'backbone';
import EventBus from 'libs/EventBus';
import ProgressbarView from 'core/shared/ProgressbarView';

// templates
import Template from 'core/section/cover/Cover.hbs';
import TemplateIncomplete from 'core/section/cover/CoverIncomplete.hbs';
import TemplateCompleted from 'core/section/cover/CoverCompleted.hbs';

export default class CoverView extends Backbone.View {

  constructor(options) {
    options = Object.assign(options || {}, {
      events: {
        'click #start-btn': 'start'
      }
    });
    super(options);
  }

  initialize() {
    console.log('CoverPageView.initialize');

    this.globalProgress = this.model.globalProgress;
    this.template = Template;

    if (this.model.lessonMode === 'normal') {
      if (this.globalProgress === 100) {
        this.template = TemplateCompleted;
      } else if (this.model.maxIndex > 0) {
        this.template = TemplateIncomplete;
      }
    }
  }

  render() {
    this.$el.html(this.template(this));

    let $progressBar = this.$('#progress-bar-cover');
    if ($progressBar.length > 0) {
      this.progressbar = new ProgressbarView({
        el: $progressBar,
        model: this.model
      });
      this.progressbar.render();
    }

    return this;
  }

  start(e) {
    e.preventDefault();

    let $startBtn = this.$('#start-btn');
    $startBtn.attr('disabled', 'disabled');

    this.stopListening();
    EventBus.trigger(EventBus.event.NAV_START);
  }
}
