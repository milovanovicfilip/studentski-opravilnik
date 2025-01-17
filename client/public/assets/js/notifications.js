document.addEventListener("DOMContentLoaded", () => {
    const notificationsDropdown = document.getElementById("notificationsDropdown");
    const notificationsList = document.getElementById("notification-items");
    const notificationCount = document.getElementById("notification-count");
    const markAllReadButton = document.getElementById("mark-all-read");

    async function fetchNotifications() {
        try {
            const response = await axios.get('/api/notifications', { withCredentials: true });
            const notifications = response.data;

            // Clear the notifications list
            notificationsList.innerHTML = "";

            if (notifications.length > 0) {
                const unreadCount = notifications.filter(n => !n.read).length;

                // Show unread count in the bell icon
                if (unreadCount > 0) {
                    notificationCount.style.display = "inline";
                    notificationCount.textContent = unreadCount;
                } else {
                    notificationCount.style.display = "none";
                }

                notifications.forEach(notif => {
                    const li = document.createElement("li");
                    li.classList.add("dropdown-item", "d-flex", "align-items-start");
                    li.innerHTML = `
                    <div class="notification-item">
                      <i class="bi ${notif.read ? 'bi-check-circle' : 'bi-exclamation-circle text-danger'}"></i>
                      <div class="notification-text">
                        <strong>${notif.title}</strong><br>
                        <small>${notif.description}</small>
                      </div>
                    </div>
                  `;

                    if (!notif.read) li.style.fontWeight = "bold"; // Highlight unread notifications

                    li.addEventListener("click", () => markNotificationAsRead(notif._id));
                    notificationsList.appendChild(li);
                });
            } else {
                notificationsList.innerHTML = `<li class="dropdown-item text-center">Ni novih obvestil</li>`;
                notificationCount.style.display = "none";
            }
        } catch (error) {
            console.error("Napaka pri pridobivanju obvestil:", error);
        }
    }

    async function markNotificationAsRead(notificationId) {
        try {
            await axios.put(`/api/notifications/${notificationId}/read`, {}, { withCredentials: true });
            fetchNotifications(); // Refresh notifications after marking as read
        } catch (error) {
            console.error("Napaka pri označevanju obvestila kot prebranega:", error);
        }
    }

    async function markAllNotificationsAsRead() {
        try {
            await axios.put(`/api/notifications/read-all`, {}, { withCredentials: true });
            fetchNotifications();
        } catch (error) {
            console.error("Napaka pri označevanju vseh obvestil:", error);
        }
    }

    // Fetch unread notifications count on page load
    fetchNotifications();

    // Load full notifications list when bell icon is clicked
    notificationsDropdown.addEventListener("click", fetchNotifications);
    markAllReadButton.addEventListener("click", markAllNotificationsAsRead);
});
