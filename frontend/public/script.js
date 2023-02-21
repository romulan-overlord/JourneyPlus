function setDimensions() {
  let windowHeight = window.innerHeight;
  let headerHeight = $("#header").outerHeight();
  let footerHeight = $("#footer").outerHeight();
  let titleHeight = $("#title-div").outerHeight();
  $("#textInput").outerHeight(windowHeight - headerHeight - footerHeight);
  let inputHeight = $("#textInput").outerHeight();
  $("#content-div").outerHeight(inputHeight - titleHeight);
  $("#media-div").outerHeight(windowHeight - headerHeight - footerHeight)
}
