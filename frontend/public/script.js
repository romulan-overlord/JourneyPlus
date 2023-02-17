function setDimensions() {
  let windowHeight = window.innerHeight;
  let headerHeight = $("#header").outerHeight();
  let footerHeight = $("#footer").outerHeight();
  let titleHeight = $("#title-div").outerHeight();
  $("#textInput").outerHeight(windowHeight - headerHeight - footerHeight);
  let inputHeight = $("#textInput").outerHeight();
  $("#content-div").outerHeight(inputHeight - titleHeight);
  $("#media-div").outerHeight(windowHeight - headerHeight - footerHeight)
  const mediaHeight = $("#media-div").outerHeight();

  console.log("native script running in EntryInput via UseEffect!!!");
  console.log(
    "window: " +
      windowHeight +
      " header: " +
      headerHeight +
      " input area: " +
      $("#textInput").outerHeight() +
      " title: " +
      titleHeight +
      " content: " +
      $("#content-div").outerHeight() +
      " media: " +
      mediaHeight
  );
}