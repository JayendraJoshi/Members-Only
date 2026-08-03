const memberToggle = document.querySelector(".member-toggle");
const adminToggle = document.querySelector(".admin-toggle");
const memberErrorContainer = document.querySelector(
  ".member-toggle-container .error-container",
);
const adminErrorContainer = document.querySelector(
  ".admin-toggle-container .error-container",
);
const memberMessageElement = document.querySelector(".member-toggle p");
const adminMessageElement = document.querySelector(".admin-toggle p");

const memberToggleContainer = document.querySelector(
  ".member-toggle-container",
);
const adminToggleContainer = document.querySelector(".admin-toggle-container");

const memberSlider = document.querySelector(".member-toggle-container .slider");
const adminSlider = document.querySelector(".admin-toggle-container .slider");

if (memberToggle) {
  memberToggle.checked = memberToggleContainer.dataset.status === "true";
  memberSlider.textContent = memberToggle.checked ? "Yes" : "No";
  memberToggle.addEventListener("change", async (event) => {
    memberSlider.textContent = memberToggle.checked ? "Yes" : "No";
    const previousChecked = !event.target.checked;
    memberErrorContainer.textContent = "";
    const params = new URLSearchParams({
      checked: String(event.target.checked),
    });
    try {
      const response = await fetch("/membership/member/change", {
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
  adminSlider.textContent = adminToggle.checked ? "Yes" : "No";
  adminToggle.addEventListener("change", async (event) => {
    adminSlider.textContent = adminToggle.checked ? "Yes" : "No";
    const previousChecked = !event.target.checked;
    adminErrorContainer.textContent = "";
    const params = new URLSearchParams({
      checked: String(event.target.checked),
    });
    try {
      const response = await fetch("/membership/admin/change", {
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
