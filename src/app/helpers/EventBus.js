import _ from 'lodash';
import Backbone from 'backbone';

export default _.extend({

    event: {
        NAV_START: "start.nav",
        NAV_LOADED: "loaded.nav",
        NAV_CHANGE: "change.nav",

        NAV_GOTO: "goto.nav",
        NAV_NEXT: "next.nav",
        NAV_PREVIOUS: "prev.nav",

        NAV_GOTO_CHAPTER: "gotoChapter.nav",
        NAV_NEXT_CHAPTER: "nextChapter.nav",
        NAV_PREVIOUS_CHAPTER: "prevChapter.nav",

        PAGE_LOAD: "load.page",
        PAGE_LOADED: "loaded.page",
        PAGE_TRANSITION_IN_COMPLETE: "transitionInComplete.page",

        STATUS_LOADED: "loaded.status",
        STATUS_CHANGE: "change.status",
        STATUS_UPDATE: "update.status",
        STATUS_FINISH: "finish.status",
        STATUS_DISPATCH: "dispatch.status",
        STATUS_SAVE: "save.status"
    }

}, Backbone.Events);
