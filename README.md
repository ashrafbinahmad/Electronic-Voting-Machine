## Environmental variables needed
- LOCAL_STORAGE_ADMIN_PASS=
- LOCAL_STORAGE_EVM_PASS=
- LOCAL_STORAGE_PUBLIC_RESULTS_PASS=
- API_KEY=
- AUTH_DOMAIN=
- PROJECT_ID=
- APP_ID=
- 

## Links
- Link to evm ui = /[LOCAL_STORAGE_EVM_PASS]
- Link to display results = /[LOCAL_STORAGE_PUBLIC_RESULTS_PASS]

## Guides
- Each candidate should leave the voting place the time they Complete the voting and hears a beep sound.
- Candidate details can be added in Consts.js file.
- The voters list and voting status should be managed externally.
- Once the Firebase firestore is connected, should make a collection of 'votes' with docs of IDs: names of each candidate categories.

![image](https://github.com/ashrafp216/EVM/assets/86481822/21b4043e-9352-494f-a44b-5ec90da3f1b9)



## Next js starting documentation
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
