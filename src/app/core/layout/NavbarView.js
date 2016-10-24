import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'libs/EventBus';

import HelpView from 'core/layout/HelpView';
import MenuView from 'core/layout/MenuView';

import Template from 'core/layout/Navbar.hbs';

export default class NavbarView extends Backbone.View {

  constructor(options) {
    options = Object.assign(options || {}, {
      events: {
        'click .navbar-btn': 'navHandler'
      }
    });
    super(options);
  }

  initialize() {
    console.log('NavbarView.initialize');

    this.template = Template;
    this.menu = new MenuView({ el: '#menu', model: this.model });
    this.help = new HelpView({ el: '#help' });

    this.listenTo(this.model, 'change', this.update);

    $(window.document).on('keydown', (e) => {
      this.keyPress(e);
    });
  }

  render() {
    console.log('NavbarView.render');

    this.$el.hide();
    this.$el.html(this.template());
    this.$el.append(this.menu.render().el);
    this.$el.fadeIn(250);

    this.help.render();

    this.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });

    return this;
  }

  onTransitionInComplete() {
    this.isPageLoading = false;
  }

  enableBtn($btn, isEnabled) {
    if (isEnabled) {
      $btn.removeAttr('disabled');
      $btn.css('cursor', '');
      $btn.fadeTo(250, 1);
    } else {
      $btn.attr('disabled', 'disabled');
      $btn.css('cursor', 'default');
      $btn.fadeTo(250, 0.1);
    }
  }

  enableNav(isEnabled) {
    let $navbarBtn = this.$('.navbar-btn');

    if (isEnabled) {
      $navbarBtn.removeAttr('disabled');
      $navbarBtn.css('cursor', '');
    } else {
      $navbarBtn.attr('disabled', 'disabled');
      $navbarBtn.css('cursor', 'default');
    }
  }

  //-- NAVIGATION FUNTCIONS
  navHandler(e) {
    let $target = this.$(e.currentTarget);
    let id = $target.attr('id');
    let isEnabled = !$target.is('[disabled]');

    if (isEnabled && !this.isPageLoading) {
      switch (id) {
        case 'next':
          EventBus.trigger(EventBus.event.NAV_NEXT);
          break;

        case 'previous':
          EventBus.trigger(EventBus.event.NAV_PREVIOUS);
          break;

        case 'menu':
          this.menu.toggle();
          break;

        case 'help':
          this.help.toggle();
          break;
      }
    }
    e.preventDefault();
  }

  keyPress(e) {
    let code = e.keyCode || e.which;
    if (code === 27) {
      //ESC press
      this.menu.hide();
      this.help.hide();
      e.preventDefault();
    }
  }
}
