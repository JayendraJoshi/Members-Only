const dialog = document.querySelector("dialog");
const openDialogButton = document.querySelector(".open-message-dialog button");
const closeDialogButton = document.querySelector("dialog .cancel-button");
const messageForm = document.querySelector(".message-form");
if (openDialogButton) {
  openDialogButton.addEventListener("click", () => {
    dialog.showModal();
  });
}
closeDialogButton.addEventListener("click", () => {
  dialog.close();
});
messageForm.addEventListener("submit", async (event) => {
  const errorContainer = document.querySelector("dialog .errors-container");
  errorContainer.textContent = "";
  event.preventDefault();
  const formData = new FormData(messageForm);
  const response = await fetch(messageForm.action, {
    method: messageForm.method,
    body: new URLSearchParams(formData),
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 500) {
      const serverError = document.querySelector(".server-error");
      serverError.textContent =
        " We couldn't create the message right now, please try again later.";
      dialog.close();
      return;
    }
    const ul = document.createElement("ul");
    ul.replaceChildren(
      ...data.errors.map((error) => {
        const li = document.createElement("li");
        li.textContent = error.msg;
        return li;
      }),
    );
    errorContainer.replaceChildren(ul);
    errorContainer.style.display = "block";
    return;
  }
  dialog.close();
  window.location.reload();
});
