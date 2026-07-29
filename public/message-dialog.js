const dialog = document.querySelector("dialog");
const openDialogButton = document.querySelector(".open-message-dialog button");
const closeDialogButton = document.querySelector("dialog .cancel-button");
const messageForm = document.querySelector(".message-form");

openDialogButton.addEventListener("click", (event) => {
  dialog.showModal();
});
closeDialogButton.addEventListener("click", (event) => {
  dialog.close();
});
messageForm.addEventListener("submit", async (event) => {
  const errorContainer = document.querySelector("dialog .error-container");
  errorContainer.textContent = "";
  event.preventDefault();
  const formData = new FormData(messageForm);
  const response = await fetch(messageForm.action, {
    method: messageForm.method,
    body: new URLSearchParams(formData),
  });
  const data = await response.json();
  if (!response.ok) {
    const ul = document.createElement("ul");
    ul.replaceChildren(
      ...data.errors.map((error) => {
        const li = document.createElement("li");
        li.textContent = error.msg;
        return li;
      }),
    );
    errorContainer.replaceChildren(ul);
    return;
  }
  dialog.close();
  window.location.href = "/home";
});
