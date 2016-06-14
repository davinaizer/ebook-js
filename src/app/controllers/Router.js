'use strict';
import Backbone from 'backbone';

export default Backbone.Router.extend({

    routes: {
        '': 'home',
        'chapter/:cId': 'gotoChapter',
        'chapter/:cId/section/:sId': 'gotoSection',
        '*default': 'gotoIndex'

    },

    initialize: () => {
        console.log("Router.initialize");
    },

    home: () => {
        console.log("Router.gotoIndex");
        Backbone.history.navigate("");
    },

    gotoChapter: (id) => {
        console.log("Router.gotoChapter:", id);
    },

    gotoSection: (chapterId, sectionId) => {
        console.log("Router.gotoSection:", chapterId, ":", sectionId);
    }
});
