# IFR Courses

The Astro application deploys to Netlify from GitHub. Lesson media and PDFs are
kept out of Git and uploaded to a private Cloudflare R2 bucket. Authenticated
media requests receive short-lived R2 URLs so large videos never pass through a
Netlify Function.

In production, account, session, and progress records use Netlify Blobs. Local
development continues to use `web/data/ifr.db`.

## Upload course content

Create a private R2 bucket and an R2 API token with object read/write access.
Then set the variables from `web/.env.example` in your shell and run:

```sh
cd web
npm run upload:content
```

The upload is repeatable. Object names match the existing course directory
structure.

## Deploy from GitHub

1. Create a GitHub repository and push this repository.
2. In Netlify, choose **Add new project** and import the GitHub repository.
3. Keep the build settings from `netlify.toml`.
4. Add the four `R2_*` variables from `web/.env.example` under Netlify project
   environment variables.
5. Deploy the site and open `/setup` to create the first admin account.

The course files remain local and in R2. They are intentionally excluded from
GitHub.
