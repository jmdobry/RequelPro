import $ from 'jQuery';

let layout = {
  maximize(selector) {
    setTimeout(() => {
      let newHeight = $(window).height() - ($('#headerRow').height() + $('#tabsRow').height());
      console.log('newHeight', newHeight);
      $(selector).outerHeight(newHeight);
      console.log($(selector).outerHeight());
    }, 30);
  }
};

export default layout;
