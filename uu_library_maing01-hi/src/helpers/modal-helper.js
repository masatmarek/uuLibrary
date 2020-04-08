const ModalHelper = {
  open(header, component) {
    UU5.Environment.getPage()
      .getModal()
      .open({
        content: component,
        header: header
      });
  },
  close() {
    UU5.Environment.getPage()
      .getModal()
      .close();
  }
};

module.exports = ModalHelper;
