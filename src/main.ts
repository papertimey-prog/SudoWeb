declare var Capacitor: any;

interface InputStore {
  value: string;
}

const web = {
  native: {
    get plugins() {
      return typeof Capacitor !== "undefined" ? Capacitor.Plugins : {};
    },
    async vibrate() {
      const { Haptics } = this.plugins;
      if (Haptics && Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: "MEDIUM" }).catch(() => {});
      }
    },
    async notify(title: string, body: string) {
      const { LocalNotifications } = this.plugins;
      if (!LocalNotifications || !Capacitor.isNativePlatform()) {
        alert(`${title}: ${body}`);
        return;
      }
      await LocalNotifications.schedule({
        notifications: [{ title, body, id: Date.now() }],
      });
    },
  },

  ui: {
    // Updated: Automatically finds the #app div if no parent is provided
    _getRoot() {
      return document.getElementById("app") || document.body;
    },

    text(content: string, fontSize = "18px") {
      const el = document.createElement("p");
      el.textContent = content;
      Object.assign(el.style, {
        fontFamily: "system-ui, sans-serif",
        fontSize: fontSize,
        color: "#1e293b",
        margin: "10px 0",
      });
      this._getRoot().appendChild(el);
      return el;
    },

    input(placeholder: string, store: InputStore) {
      const el = document.createElement("input");
      el.placeholder = placeholder;
      Object.assign(el.style, {
        width: "100%",
        maxWidth: "350px",
        padding: "16px",
        margin: "10px 0",
        borderRadius: "12px",
        border: "2px solid #cbd5e1",
        fontSize: "16px",
        outline: "none",
      });
      el.oninput = () => {
        store.value = el.value;
      };
      this._getRoot().appendChild(el);
      return el;
    },

    button(title: string, action: () => void) {
      const btn = document.createElement("button");
      btn.textContent = title;
      Object.assign(btn.style, {
        width: "100%",
        maxWidth: "350px",
        padding: "16px",
        margin: "10px 0",
        borderRadius: "12px",
        border: "none",
        backgroundColor: "#3b82f6",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
      });

      btn.onclick = async () => {
        await web.native.vibrate();
        action();
      };

      this._getRoot().appendChild(btn);
      return btn;
    },
  },
};

/**
 * --- USAGE ---
 * Vite will exedcute this immediately
 */
const state: InputStore = { value: "" };

// Logic to run the app
const startApp = () => {
  web.ui.text("Vite App Loaded ✅", "24px");
  web.ui.input("Enter something...", state);
  web.ui.button("Test Notification", () => {
    web.native.notify("Success", state.value || "It works!");
  });
};

// Start
startApp();
