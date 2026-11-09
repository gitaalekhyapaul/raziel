# Showcase deployment

Open [site/index.html](../site/index.html) locally to review the static site. The
site uses HTML, CSS, and a small form handler. It does not start the backend,
build the submodules, or require a package manager.

## GitHub Pages

1. In [Settings > Pages](https://github.com/gitaalekhyapaul/raziel/settings/pages),
   set **Source** to **GitHub Actions**.
2. Open [Deploy showcase to GitHub Pages](https://github.com/gitaalekhyapaul/raziel/actions/workflows/pages.yml),
   choose **Run workflow**, and select `main`. The workflow uploads only
   `site/` and does not run on push.
3. Check the site at `https://gitaalekhyapaul.github.io/raziel/` before
   attaching the custom domain.
4. In **Settings > Pages**, add `raziel.gpaul.cc` as the **Custom domain**.
   Check the existing Cloudflare record before replacing it. Set the `raziel`
   **CNAME** to `gitaalekhyapaul.github.io` with **DNS only**.
5. Once GitHub provisions the certificate, select **Enforce HTTPS** and
   verify the custom domain from a phone.

[Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
· [Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain)

## Contact form

1. The form's `action` in [site/index.html](../site/index.html) is set to
   `https://formspree.io/f/mvkkjged`. Formspree receives the named HTML fields
   from the page. It does not need a separate field setup.
2. In Formspree, check the inbox selected for notifications.
3. From the deployed page, send one labelled test inquiry and confirm it
   arrives in the private dashboard and the notification inbox. Check the
   success state and the mobile layout.

The form asks for a name, work email, organisation, and workflow description.
It instructs visitors to omit confidential data and credentials. No submission
data belongs in Git. The endpoint is public. Keep account passwords, API keys,
and response exports private. Review the owner's retention and notification
settings before publication.

[Formspree HTML form setup](https://help.formspree.io/articles/building-your-form/building-an-html-form)

## Final check

- `https://raziel.gpaul.cc` opens over HTTPS on a phone.
- **Vote MCOMP-04** opens the official UVents voting page directly.
- **Discuss a pilot** scrolls to the contact section.
- The contact form delivers a test inquiry.
- Only the static showcase is served. The component repositories, runtime state,
  and credentials are outside the deployed root.
