Finally got around to completing this application, took me longer than I would have liked. This is just a basic CRUD application.
I used React, TypeScript, Vite, Tailwind, and Supabase. I made this as a demo app in our capstone tech stack and it incorporates
much of what we'll be doing in the real capstone app. Now we can go back to this one for reference. Feel free to look through
my code and test out the site. I think I wrote some good comments that explain what is going on. Honestly, even feel free to
add a new component to get a feel for things. If you do, you'll notice the workflow. Create component -> create page -> add
page to router in App.tsx -> add link on navbar. You may also notice that I have certain functions in my components that have
zero React and just simply talk to Supabase. I then use these functions as mutationFn later on. You'll also see I used interfaces
to define the shape of messages or auth context. Just type safety in TypeScript, not needed but I like it. You'll also see that I
have global styles (index.css) with nothing in it. I imported tailwind into it but just decided to do all my styles inline. I'll
mention that I pushed the .env file to GitHub because I didn't put it in the gitignore. Let's as a group learn from my stupidity
and not do that with the real project. I think that'll be all, here is all the commands I ran in the terminal to get this project
started:

npx create-vite 
npm install
npm install @supabase/supabase-js @tanstack/react-query tailwindcss @tailwindcss/vite react-router

After that, I went to main.tsx and wrapped <App /> with all the necessary providers. Then, I defined the routes in App.tsx.
Following that, I went to vite.config.ts and added Tailwind to the plug-ins. Next, I made the supabase-client.ts and the .env
with the anon key. I believe that was all I needed to do and then I was able to get started on my home page and other components. 