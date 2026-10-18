This folder should contain the vis-network production files so the Total Darkness site does not rely on external CDNs.

Recommended files to place here (matching the versions referenced in the original site):
- vis-network.min.js    (UMD build: https://unpkg.com/vis-network/standalone/umd/vis-network.min.js)
- vis-network.min.css   (CSS: https://unpkg.com/vis-network/styles/vis-network.min.css)

How to install locally:
1) Download the files from the URLs above and put them into this folder.
2) Keep the filenames exactly as listed so the site loads them automatically.

Why this helps:
- Avoids blocked CDN requests on some hosting environments.
- Improves availability and reduces external dependencies.

If you cannot download the files right now, a JavaScript stub is provided (vis-network.min.js). It will prevent runtime crashes but does NOT implement the real visualization features.
Replace the stub with the real library for full functionality.
