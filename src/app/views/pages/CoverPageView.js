import $ from 'jquery';
import Backbone from 'backbone';
import TweenMax from 'gsap';
import template from 'templates/pages/cover.hbs';

export default Backbone.View.extend({

    el: $("#page"),

    template: template,

    events: {
        'click button#start-btn': '_start'
    },

    initialize() {
        console.log("CoverPageView.initialize");
    },

    render() {
        this.$el.html(this.template(this.model));
        return this;
    },

    _start() {
        var $_startBtn = this.$("#start-btn");
        $_startBtn.text("Aguarde");
        $_startBtn.attr('disabled', 'disabled');

        //-- Fetch StatusModel
        this.model.fetch();
    }

});
