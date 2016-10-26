import Backbone from 'backbone';
import EventBus from 'libs/EventBus';
import TweenMax from 'gsap';

export default class SectionView extends Backbone.View {

  constructor(options) {
    options = Object.assign(options || {}, {
      events: {
        'click #btn-next-section': 'next'
      }
    });
    super(options);
  }

  initialize() {
    this.isVisited = false;
  }

  bootstrap() {
    EventBus.trigger(EventBus.event.PAGE_LOADED);
  }

  render() {
    this.$el.css({ opacity: 0 });
    this.$el.html(this.template(this.model));

    return this;
  }

  transitionIn() {
    TweenMax.to(this.$el, 0.5, { opacity: 1, onComplete: this.transitionInComplete, onCompleteScope: this });
  }

  transitionInComplete() {
    EventBus.trigger(EventBus.event.PAGE_TRANSITION_IN_COMPLETE);
  }

  hideNextBtn(duration) {
    TweenMax.to(this.$('#btn-next-section'), duration || 0.25, { autoAlpha: 0 });
  }

  showNextBtn(duration) {
    if (!this.isVisited) {
      TweenMax.to(this.$('#btn-next-section'), duration || 0.25, { autoAlpha: 1 });
    }
  }

  next(e) {
    if (!this.isVisited) {
      this.hideNextBtn();
      this.isVisited = true;
      EventBus.trigger(EventBus.event.NAV_NEXT);
    }
    e.preventDefault();
  }
}
