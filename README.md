# Ravi Kiran — Developer Portfolio

A responsive, single-page developer portfolio built with HTML, CSS, and vanilla JavaScript. The background uses Three.js for a subtle 3D particle field and rotating wireframe geometry; the portrait and project cards also have restrained 3D tilt interactions on devices that support hover.

## Run locally

No build step is required.

1. Extract this folder.
2. Open `index.html` in a modern browser, or run a local static server from this folder:

   ```bash
   python3 -m http.server 8000
   ```

3. Visit `http://localhost:8000`.

The Three.js background and Google Fonts require an internet connection. If Three.js or WebGL is unavailable, the rest of the portfolio still works.

## Before publishing

- Verify every project repository URL and its current features.
- Add your current resume PDF if you want a dedicated resume download button.
- Confirm the contact email is the address you want publicly displayed.
- Add verified certification details and CGPA if desired.
- Test on a phone and desktop browser.

The contact form uses `mailto:` and opens the visitor's default email app; it does not submit to a server or store messages.
