import Backbone from 'backbone';
import EventBus from 'libs/EventBus';

import Template from 'core/layout/Help.hbs';

export default class HelpView extends Backbone.View {

  constructor(options) {
    options = Object.assign(options || {}, {
      events: {
        'click a': 'navHandler'
      }
    });
    super(options);
  }

  initialize() {
    this.bind('navHandler', 'keyPress');

    this.isOpen = false;
    this.template = Template;
  }

  render() {
    console.log('HelpView.render');

    this.$el.html(this.template());

    return this;
  }

  show() {
    if (!this.isOpen) {
      this.isOpen = true;

      this.$('.help').height('100%');
      this.$('.help').scrollTop(0);
      $('body').css('overflow', 'hidden');
    }
  }

  hide() {
    if (this.isOpen) {
      this.isOpen = false;

      this.$('.help').height(0);
      $('body').css('overflow', 'scroll');
    }
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  //-- NAVIGATION FUNTCIONS
  navHandler(e) {
    let $target = this.$(e.currentTarget);
    let id = $target.attr('id');
    let isEnabled = !$target.is('[disabled]') && (id.indexOf('btn-help-') > -1);

    if (isEnabled) {
      this.hide();
    }
    e.preventDefault();
  }
}
