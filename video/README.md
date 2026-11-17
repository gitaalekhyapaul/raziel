# Raziel access explainer

`index.jsx` defines six Remotion scenes. `video.css` uses the showcase's existing
typefaces. The opening artwork lives in `site/assets/explainer/source-artwork.webp`.
ImageGen generated the opening illustration from a prompt for a forest-green
editorial composition with agent nodes on the right sending requests to data
services. The diagrams and captions are editable in the composition.

Render from the repository root with Remotion CLI 4.0.544 and the matching
`remotion` package, plus React and React DOM 19.2.0. Resolve the packages from
the project or a `video/node_modules` link to the global npm root.

```sh
remotion render video/index.jsx RazielTrustExplainer \
  site/assets/explainer/raziel-trust-explainer.mp4 \
  --public-dir=site/assets --codec=h264 --crf=21 --muted

remotion still video/index.jsx RazielTrustExplainer raziel-trust-cover.png \
  --frame=85 --public-dir=site/assets
```

Encode the still as WebP at `site/assets/explainer/raziel-trust-poster.webp`.
The site serves the video and still directly through GitHub Pages. Update the
transcript in `site/index.html` when the scene sequence or claims change.
