import $ from 'jQuery';

let layout = {
  maximize(selector) {
    setTimeout(() => {
      let newHeight = $(window).height() - ($('#headerRow').height() + $('#tabsRow').height());
      $(selector).outerHeight(newHeight);
    });
  }
};

export default layout;
