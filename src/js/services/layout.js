import $ from 'jQuery';

export const layout = {
  maximize(selector, additionalOffset) {
    additionalOffset = additionalOffset || 0;
    setTimeout(() => {
      let newHeight = $(window).height() - ($('#headerRow').height() + $('#tabsRow').height() + additionalOffset);
      $(selector).outerHeight(newHeight);
    });
  },
  keepMaximized(selector, additionalOffset) {
    additionalOffset = additionalOffset || 0;
    setTimeout(() => {
      let newHeight = $(window).height() - ($('#headerRow').height() + $('#tabsRow').height() + additionalOffset);
      $(selector).outerHeight(newHeight);
    });
  },
  getMaxHeight(offset) {
    return $(window).height() - ($('#headerRow').height() + $('#tabsRow').height() + offset);
  }
}
