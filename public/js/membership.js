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

if (memberToggle) {
  memberToggle.checked = memberToggleContainer.dataset.status === "true";
  memberToggle.addEventListener("change", async (event) => {
    memberErrorContainer.textContent = "";
    const params = new URLSearchParams({
      checked: String(event.target.checked),
    });
    const response = await fetch("/membership/member/change", {
      method: "post",
      body: params,
    });
    const data = await response.json();
    if (!response.ok) {
      memberErrorContainer.replaceChildren(
        ...data.errors.map((error) => {
          const p = document.querySelector("p");
          p.textContent = error.message;
          return p;
        }),
      );
    }
  });
}

if (adminToggle) {
  adminToggle.checked = adminToggleContainer.dataset.status === "true";
  adminToggle.addEventListener("change", async (event) => {
    adminErrorContainer.textContent = "";
    const params = new URLSearchParams({
      checked: String(event.target.checked),
    });
    const response = await fetch("/membership/admin/change", {
      method: "post",
      body: params,
    });
    const data = await response.json();
    if (!response.ok) {
      adminErrorContainer.replaceChildren(
        ...data.errors.map((error) => {
          const p = document.querySelector("p");
          p.textContent = error.message;
          return p;
        }),
      );
    }
  });
}
