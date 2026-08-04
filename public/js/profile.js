const memberToggle = document.querySelector(".member-toggle");
const adminToggle = document.querySelector(".admin-toggle");
const memberErrorContainer = document.querySelector(
  ".member-toggle-container .errors-container",
);
const adminErrorContainer = document.querySelector(
  ".admin-toggle-container .errors-container",
);

const memberToggleContainer = document.querySelector(
  ".member-toggle-container",
);
const adminToggleContainer = document.querySelector(".admin-toggle-container");

const memberLabel = document.querySelector(".member-toggle-container label");
const adminLabel = document.querySelector(".admin-toggle-container label");

if (memberToggle) {
  memberToggle.checked = memberToggleContainer.dataset.status === "true";
  memberLabel.textContent = memberToggle.checked ? "Yes" : "No";
  memberToggle.addEventListener("change", async (event) => {
    memberLabel.textContent = memberToggle.checked ? "Yes" : "No";
    const previousChecked = !event.target.checked;
    memberErrorContainer.textContent = "";
    const params = new URLSearchParams({
      checked: String(event.target.checked),
    });
    try {
      const response = await fetch("/profile/member/change", {
        method: "post",
        body: params,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }
    } catch (error) {
      console.error(error);
      const p = document.createElement("p");
      p.textContent =
        "We couldn't change your member status right now, please try again later.";
      memberErrorContainer.appendChild(p);
      event.target.checked = previousChecked;
    }
  });
}

if (adminToggle) {
  adminToggle.checked = adminToggleContainer.dataset.status === "true";
  adminLabel.textContent = adminToggle.checked ? "Yes" : "No";
  adminToggle.addEventListener("change", async (event) => {
    adminLabel.textContent = adminToggle.checked ? "Yes" : "No";
    const previousChecked = !event.target.checked;
    adminErrorContainer.textContent = "";
    const params = new URLSearchParams({
      checked: String(event.target.checked),
    });
    try {
      const response = await fetch("/profile/admin/change", {
        method: "post",
        body: params,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }
    } catch (error) {
      console.error(error);
      const p = document.createElement("p");
      p.textContent =
        "We couldn't change your admin status right now, please try again later.";
      adminErrorContainer.appendChild(p);
      event.target.checked = previousChecked;
    }
  });
}
