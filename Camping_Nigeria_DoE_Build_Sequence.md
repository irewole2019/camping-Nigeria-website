**CAMPING NIGERIA**

Claude Code Build Sequence

Duke of Edinburgh Website Feature

Next.js App Router + Tailwind + Resend + Vercel

**12 steps. Run them in order. Do not skip the checkpoints.**

*Estimated build time: 3 to 5 focused sessions*

> **How to Use This Document**

Each step has three parts. Read them in this order before you paste
anything into Claude Code.

|  |  |
|:--:|:--:|
| **Part** | **What to do** |
| **What this step does** | Read this first. It tells you in plain English what Claude Code will build and why it comes in this order. |
| **Prompt to paste** | Copy the dark box exactly. Paste it into Claude Code. Do not edit it unless instructed. |
| **Checkpoint** | Before moving to the next step, confirm the checkpoint passes. Green box means go. If it fails, fix it before continuing. |

> *Claude Code works best when you run one step at a time. If you paste
> multiple steps at once it may combine or skip things. Stay in order.*
>
> **Warning: Never paste a step into Claude Code while it still has
> uncommitted changes from the previous step. Commit or save working
> code before moving on.**
>
> **Build Overview**

|  |  |  |  |
|:--:|:--:|:--:|:--:|
| **Step** | **Name** | **What gets built** | **Touches** |
| **1** | **Codebase Audit** | Claude Code reads the project and reports back | Read only |
| **2** | **Tailwind Brand Tokens** | Teal and gold colours added to tailwind config | tailwind.config |
| **3** | **DoE Callout Component** | New component: DoECallout.tsx | New file |
| **4** | **Insert Callout into /schools** | Callout placed between two existing sections | /app/schools/page.tsx |
| **5** | **New Page Shell** | /schools/international-award page created with layout | New file |
| **6** | **Static Page Sections** | Hero, Award explainer, Expedition, Our Role, Tiers, FAQ | New components |
| **7** | **Assessment Shell** | Multi-step component with state and question structure | New file |
| **8** | **Assessment Logic and Results** | Tier logic, results copy, all three result screens | Assessment component |
| **9** | **Resend API Route** | API endpoint that emails lead data on submission | New API route |
| **10** | **Wire Assessment to API** | Assessment submits to Resend route, shows results | Assessment component |
| **11** | **Calendar Embed on Results** | Booking link embedded on each result screen | Assessment component |
| **12** | **Final Review and Deploy Check** | Claude Code checks for issues before Vercel deploy | Whole project |

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 1</strong></p>
<p><strong>Codebase Audit</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>Before writing any code, Claude Code needs to understand how the
project is structured. This step has no output other than a report. Read
the report carefully before proceeding. The findings from this step are
referenced in every step that follows.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># CODEBASE AUDIT</p>
<p># Do not write any code in this step. Read and report only.</p>
<p>Please audit this Next.js project and tell me:</p>
<p>1. Confirm the router type. Check whether the project uses /app or
/pages</p>
<p>directory structure.</p>
<p>2. Find the schools page. What is the exact file path of the main
schools</p>
<p>page? List the top-level sections or components it renders, in
order.</p>
<p>3. Check Tailwind. Is tailwind.config.js or tailwind.config.ts
present?</p>
<p>Does it define any custom colours or brand tokens? List them if
so.</p>
<p>4. List shared components. What reusable components exist in the
project?</p>
<p>Focus on layout wrappers, section containers, buttons, and cards.</p>
<p>5. Check the Resend setup. Is @resend/react or resend installed?</p>
<p>Is there an existing API route that uses Resend? If so, show me
its</p>
<p>file path and the basic shape of how it sends email.</p>
<p>6. Check environment variables. Is there a .env.local or
.env.example</p>
<p>file? List any Resend-related variable names without showing
values.</p>
<p>Do not modify any files. Report your findings clearly under each
numbered</p>
<p>heading above.</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: Claude Code returns a clear report on all six points. No
> files have been created or modified. Read the report before moving to
> Step 2.**
>
> *If Claude Code cannot find the schools page, check whether it is
> named page.tsx, page.jsx, or index.tsx inside /app/schools.*
>
> *If Resend is not installed, note this. Step 9 will install it. Do not
> install it now.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 2</strong></p>
<p><strong>Tailwind Brand Tokens</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>This step adds the Camping Nigeria brand colours to the Tailwind
config so every component in this build can use them as utility classes
rather than hardcoded hex values. This makes future design updates a
single-file change.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># TAILWIND BRAND TOKENS</p>
<p>Open tailwind.config.js (or tailwind.config.ts if that is what
exists).</p>
<p>Add the following brand colours to the theme.extend.colors
section.</p>
<p>If theme.extend does not exist yet, create it. Do not remove any</p>
<p>existing colour tokens.</p>
<p>Brand colours to add:</p>
<p>cn-teal: #0F3D2E (primary dark green, used for headings and
backgrounds)</p>
<p>cn-gold: #E6B325 (accent, used for CTAs and highlights)</p>
<p>cn-ivory: #F3EFE6 (warm off-white background)</p>
<p>cn-lteal: #E8F0ED (light teal, used for section backgrounds)</p>
<p>cn-lgold: #FDF6E3 (light gold, used for callout backgrounds)</p>
<p>After editing the config, confirm the change by showing me the
updated</p>
<p>theme.extend.colors block.</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: The tailwind.config file shows cn-teal, cn-gold,
> cn-ivory, cn-lteal, and cn-lgold under theme.extend.colors. No other
> config changes have been made.**
>
> *If the project uses a CSS variables approach for theming instead of
> Tailwind tokens, tell me before continuing. The component prompts will
> need to be adjusted.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 3</strong></p>
<p><strong>DoE Callout Component</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>This builds the standalone callout section that will sit on the
/schools page. It is built as its own component first and inserted into
the page in Step 4. Building it separately lets you review and adjust
the component before touching the existing page.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># DOE CALLOUT COMPONENT</p>
<p>Create a new file: components/schools/DoECallout.tsx</p>
<p>(If a components/schools/ directory does not exist, create it.)</p>
<p>This is a full-width section component with a dark teal
background</p>
<p>(cn-teal). It will sit on the /schools page between the</p>
<p>'Why Outdoor Learning Matters' section and the 'Our School
Programs'</p>
<p>section.</p>
<p>Content to include:</p>
<p>Section label (small caps, gold): FEATURED PROGRAM</p>
<p>Headline (large, white):</p>
<p>Supporting Schools Running the Duke of Edinburgh Award</p>
<p>Body copy (white, normal weight):</p>
<p>Known in Nigeria as the International Award for Young People,</p>
<p>the Duke of Edinburgh Award is one of the most recognised youth</p>
<p>development programs in the world. The expedition component is</p>
<p>one of the most meaningful parts of the journey. It is also the</p>
<p>part most schools find hardest to organise.</p>
<p>Camping Nigeria provides the equipment, the facilitators, and</p>
<p>the outdoor programming that schools need to run their expedition</p>
<p>properly. We are not an Award operator. We are the partner that</p>
<p>makes the outdoor delivery work.</p>
<p>Two buttons side by side:</p>
<p>Primary (gold background, teal text):</p>
<p>'Find Out If We Are the Right Fit'</p>
<p>href='/schools/international-award#assessment'</p>
<p>Secondary (transparent, gold border, gold text):</p>
<p>'Learn About the Award'</p>
<p>href='/schools/international-award#award'</p>
<p>Design notes:</p>
<p>- Full width section, generous vertical padding (py-20 or
similar)</p>
<p>- Consider a subtle low-opacity outdoor image as background if</p>
<p>a suitable image exists in /public/images/schools/</p>
<p>- Buttons should stack vertically on mobile</p>
<p>- Match the visual weight and spacing of existing sections on</p>
<p>the schools page</p>
<p>Do not import or use this component anywhere yet.</p>
<p>Just create the file and show me a preview of the output.</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: The file components/schools/DoECallout.tsx exists and
> renders correctly in isolation. The two buttons have the correct
> hrefs. No existing files have been changed.**
>
> *If the project has an existing Button component, use it. If not,
> Claude Code should style the buttons inline with Tailwind classes for
> now.*
>
> *The section does not need a real background image to pass the
> checkpoint. A solid cn-teal background is fine at this stage.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 4</strong></p>
<p><strong>Insert Callout into /schools Page</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>This step places the DoECallout component into the existing schools
page in the correct position. The existing page structure is not changed
in any other way. This is the only edit to the schools page in this
entire build.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># INSERT CALLOUT INTO SCHOOLS PAGE</p>
<p>Open the main schools page file. Based on the audit in Step 1,</p>
<p>this should be at app/schools/page.tsx or similar.</p>
<p>Import the DoECallout component:</p>
<p>import DoECallout from '@/components/schools/DoECallout'</p>
<p>Find the section that contains 'Why Outdoor Learning Matters'</p>
<p>or similar heading about outdoor learning benefits.</p>
<p>Find the section immediately after it that contains the school</p>
<p>programs (2-Day On-Campus Camps, Nature &amp; Craft, Leadership</p>
<p>Development).</p>
<p>Insert &lt;DoECallout /&gt; between these two sections.</p>
<p>Do not move, remove, or modify any other content on the page.</p>
<p>Show me the relevant portion of the updated page file so I can</p>
<p>confirm the placement is correct.</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: The schools page file now includes DoECallout between
> the outdoor learning benefits section and the programs section. No
> other content on the page has changed. Visit /schools locally to
> confirm the section appears in the right place.**
>
> *If Claude Code cannot identify which sections are which, ask it to
> list all the top-level JSX elements or section components on the page
> first, then decide together where the callout goes.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 5</strong></p>
<p><strong>New Page Shell -
/schools/international-award</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>This creates the new page file and its basic layout structure. No
real content yet - just the page skeleton with named section anchors.
Getting the structure right here means the remaining content steps each
drop into a clearly labelled slot.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># NEW PAGE SHELL</p>
<p>Create a new Next.js App Router page at:</p>
<p>app/schools/international-award/page.tsx</p>
<p>The page should have the following structure:</p>
<p>- A standard page wrapper consistent with the rest of the site</p>
<p>- Seven named section anchors in this order:</p>
<p>id='hero'</p>
<p>id='award'</p>
<p>id='expedition'</p>
<p>id='our-role'</p>
<p>id='what-we-provide'</p>
<p>id='assessment'</p>
<p>id='faq'</p>
<p>- Each section should render a placeholder div with the section</p>
<p>name as visible text so we can confirm the structure before</p>
<p>adding content</p>
<p>- Set the page title metadata to:</p>
<p>'Duke of Edinburgh Expedition Support | Camping Nigeria'</p>
<p>- Set the page description metadata to:</p>
<p>'Camping Nigeria supports schools running the Duke of Edinburgh</p>
<p>Award in Nigeria. Equipment, facilitators, and structured outdoor</p>
<p>programming for school expeditions.'</p>
<p>Do not add any real content sections yet. Placeholder divs only.</p>
<p>Show me the file once created.</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: Navigating to /schools/international-award in the
> browser shows a page with seven visible placeholder sections labelled
> with their IDs. Page title metadata is set correctly.**
>
> *The metadata should use Next.js App Router conventions - either a
> metadata export or generateMetadata function, not a \<Head\> tag which
> is Pages Router syntax.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 6</strong></p>
<p><strong>Static Page Sections</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>This step fills in five of the seven sections with their real
content. The assessment section (Step 7-10) and the results screen (Step
11) are left as placeholders for now. All five sections here are static
- no interactivity, no forms, no API calls.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># STATIC PAGE SECTIONS</p>
<p>Update app/schools/international-award/page.tsx to replace the</p>
<p>placeholder divs for these five sections with real content:</p>
<p>hero, award, expedition, our-role, what-we-provide, faq</p>
<p>Leave the 'assessment' section as a placeholder for now.</p>
<p>Use the exact copy below for each section.</p>
<p>---</p>
<p>SECTION: hero (full-width, dark teal background, white text)</p>
<p>Label: OUTDOOR EXPEDITION SUPPORT</p>
<p>Headline: We Help Nigerian Schools Run the</p>
<p>Duke of Edinburgh Expedition.</p>
<p>Subtitle: Camping Nigeria provides the equipment, the
facilitators,</p>
<p>and the outdoor structure schools need to deliver the</p>
<p>expedition component of the Award. We handle the logistics.</p>
<p>Your students get the experience.</p>
<p>Button: 'Find My School's Expedition Setup'</p>
<p>href='#assessment'</p>
<p>---</p>
<p>SECTION: award (light background, standard layout)</p>
<p>Label: ABOUT THE AWARD</p>
<p>Headline: What Is the Duke of Edinburgh Award?</p>
<p>Body:</p>
<p>The Duke of Edinburgh Award - officially known in Nigeria as the</p>
<p>International Award for Young People - is a globally recognised</p>
<p>program that challenges young people across four areas: physical</p>
<p>activity, skill development, voluntary service, and an outdoor</p>
<p>expedition.</p>
<p>The Award is administered in Nigeria by the International Award</p>
<p>Association Nigeria. To learn more about how the program works</p>
<p>and how schools get accredited, visit:</p>
<p>Two text links (open in new tab):</p>
<p>International Award Nigeria href='https://intaward.org.ng'</p>
<p>The Duke of Edinburgh's Award href='https://www.dofe.org'</p>
<p>---</p>
<p>SECTION: expedition (cn-ivory background)</p>
<p>Label: THE EXPEDITION</p>
<p>Headline: What the Expedition Actually Involves</p>
<p>Body:</p>
<p>The expedition is the outdoor component of the Award. Students</p>
<p>plan and carry out a journey in a natural environment - usually</p>
<p>over one to four days depending on the Award level. They camp</p>
<p>overnight, navigate their route, and complete the journey as a
team.</p>
<p>For Bronze level, this is typically a two-day, one-night</p>
<p>expedition. Silver and Gold levels involve longer journeys</p>
<p>with higher demands.</p>
<p>Schools are responsible for ensuring students are prepared and</p>
<p>that the expedition meets Award requirements. That preparation</p>
<p>involves planning routes, sourcing equipment, arranging
facilitation,</p>
<p>and making sure the outdoor experience is safe and structured.</p>
<p>Most schools find this the hardest part to execute well.</p>
<p>That is where we come in.</p>
<p>---</p>
<p>SECTION: our-role (white background)</p>
<p>Label: OUR ROLE</p>
<p>Headline: We Handle the Outdoor Delivery. You Handle the Award.</p>
<p>Body:</p>
<p>Camping Nigeria is not an Award operator. We do not administer</p>
<p>the International Award program or verify compliance with Award</p>
<p>requirements. What we do is handle the outdoor component that</p>
<p>makes expeditions real.</p>
<p>We provide: (render as a clean list with checkmark or bullet
icons)</p>
<p>- Camping equipment: tents, sleeping bags, sleeping mats,</p>
<p>and lighting for up to 100 students</p>
<p>- Trained outdoor facilitators on-site throughout the program</p>
<p>- Structured outdoor programming: eco-awareness, team challenges,</p>
<p>and guided outdoor skills sessions</p>
<p>- Safety protocols, risk assessments, and emergency contact</p>
<p>documentation</p>
<p>- Parent communication packs pre-written and ready for your</p>
<p>school to send</p>
<p>- A post-event debrief report for school leadership</p>
<p>Closing line:</p>
<p>Your school's Award Coordinator or Licensed Operator continues</p>
<p>to manage the compliance side. We make the outdoor delivery
happen.</p>
<p>---</p>
<p>SECTION: what-we-provide (cn-lteal background)</p>
<p>Label: HOW WE WORK WITH SCHOOLS</p>
<p>Headline: Three Ways to Work With Us</p>
<p>Intro: We offer three levels of support depending on how much</p>
<p>your school wants to manage itself.</p>
<p>Render as three cards side by side (stack on mobile):</p>
<p>Card 1 - BASE CAMP</p>
<p>From 3,000,000 Naira</p>
<p>Equipment only. We deliver and collect tents, sleeping bags,</p>
<p>mats, and lighting. Your school runs its own program.</p>
<p>Best for: Schools that have facilitation covered.</p>
<p>Card 2 - TRAIL READY (visually highlighted as most popular)</p>
<p>From 5,000,000 Naira</p>
<p>Equipment plus facilitation. Our team is on-site throughout.</p>
<p>We design and run the outdoor program.</p>
<p>Best for: Schools that want a structured program.</p>
<p>Card 3 - SUMMIT PARTNER</p>
<p>From 8,000,000 Naira</p>
<p>Fully managed. Equipment, facilitation, catering coordination,</p>
<p>first aid, certificates, and documentation.</p>
<p>Best for: Schools that want everything handled.</p>
<p>Link below cards:</p>
<p>'See the full offer breakdown' href='/schools'</p>
<p>---</p>
<p>SECTION: faq (white background)</p>
<p>Label: COMMON QUESTIONS</p>
<p>Headline: Frequently Asked Questions</p>
<p>Render as an accordion or clean stacked list. Five questions:</p>
<p>Q: Are you an accredited Duke of Edinburgh or International</p>
<p>Award operator?</p>
<p>A: No. We are an outdoor programming and equipment partner.</p>
<p>We support schools in delivering the camping and outdoor</p>
<p>activity components of the expedition. Your Award Coordinator</p>
<p>or Licensed Operator confirms compliance with the Award
framework.</p>
<p>Q: Can you work with our school even if we are not yet running</p>
<p>the Award?</p>
<p>A: Yes. We work with schools running the Award and schools that</p>
<p>run outdoor enrichment programs, end-of-term camps, and</p>
<p>leadership experiences.</p>
<p>Q: What if we already have some of our own equipment?</p>
<p>A: We can provide facilitation and programming without the full</p>
<p>equipment package. Tell us what you already have and we will</p>
<p>build a quote around your actual needs.</p>
<p>Q: How many students can you accommodate?</p>
<p>A: Our standard capacity is up to 100 students. Larger groups</p>
<p>can be discussed.</p>
<p>Q: How far in advance do we need to book?</p>
<p>A: We recommend six to eight weeks for full program packages</p>
<p>and two to four weeks for equipment rental only.</p>
<p>Two CTAs below the FAQ:</p>
<p>Primary: 'Book a Planning Call' href='#assessment'</p>
<p>Secondary: 'Request a School Proposal'</p>
<p>href='/schools/proposal'</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: All five sections render on the page with correct copy.
> The assessment section is still a placeholder. The page flows hero to
> award to expedition to our-role to what-we-provide to assessment
> (placeholder) to faq. External links open in a new tab.**
>
> *If Claude Code asks whether to create separate component files for
> each section or inline them into the page file, separate component
> files in components/schools/international-award/ is the cleaner
> approach.*
>
> *The three-card tier section should visually highlight Trail Ready as
> the recommended option - a slightly different card style, a 'Most
> Popular' badge, or similar treatment.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 7</strong></p>
<p><strong>Assessment Shell - Structure and State</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>The assessment is the most complex component in this build. This step
creates the shell: the component file, the state management for tracking
the current question and answers, and the four questions rendered one at
a time. No results logic yet - just the question flow.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># ASSESSMENT SHELL</p>
<p>Create a new client component file:</p>
<p>components/schools/international-award/ExpeditionAssessment.tsx</p>
<p>This is a 'use client' component. It manages multi-step state</p>
<p>internally using useState.</p>
<p>Phase structure:</p>
<p>Phase 1: Lead capture form (name, email, school name)</p>
<p>Phase 2: Questions (one at a time, Q1 through Q4)</p>
<p>Phase 3: Results screen (built in Step 8)</p>
<p>State to track:</p>
<p>- currentPhase: 'capture' | 'questions' | 'results'</p>
<p>- currentQuestion: number (0-3)</p>
<p>- answers: object storing the answer for each question</p>
<p>- leadData: object storing name, email, school</p>
<p>Phase 1 - Lead capture form:</p>
<p>Label: LET'S FIND THE RIGHT SETUP FOR YOUR SCHOOL</p>
<p>Headline: Four quick questions. Your recommendation in</p>
<p>under two minutes.</p>
<p>Fields:</p>
<p>Your name (required)</p>
<p>Your email (required, type email)</p>
<p>School or organisation name (required)</p>
<p>Button: 'Get My Recommendation'</p>
<p>On submit: validate fields, move to Phase 2</p>
<p>Phase 2 - Question flow:</p>
<p>Show one question at a time with a progress indicator</p>
<p>(e.g. 'Question 1 of 4').</p>
<p>Each question has four answer options as large clickable cards.</p>
<p>Selecting an option auto-advances to the next question.</p>
<p>After Q4, transition to Phase 3 (results - placeholder for now).</p>
<p>Q1: Who are you planning this for?</p>
<p>A) I am a principal or teacher at a school</p>
<p>B) I am a parent whose child is doing the Award</p>
<p>C) I am an Award Coordinator looking for a partner</p>
<p>D) I am exploring options and not sure yet</p>
<p>Q2: Is your school currently running the Duke of Edinburgh Award?</p>
<p>A) Yes, we are already running it</p>
<p>B) We are considering starting it</p>
<p>C) No, but we run other outdoor or enrichment programs</p>
<p>D) I am not sure</p>
<p>Q3: How many students are you thinking of including?</p>
<p>A) Under 30 students</p>
<p>B) 30 to 60 students</p>
<p>C) 60 to 100 students</p>
<p>D) More than 100 students</p>
<p>Q4: How much of the program does your school want to manage?</p>
<p>A) Equipment only - we will run the program ourselves</p>
<p>B) Equipment and facilitators - we need the program run for us</p>
<p>C) Everything managed - equipment, facilitation, safety,</p>
<p>catering, and documentation</p>
<p>D) We are not sure yet - we need guidance</p>
<p>Phase 3: Show a placeholder div with text 'Results will appear
here'</p>
<p>for now. This is replaced in Step 8.</p>
<p>Import and render &lt;ExpeditionAssessment /&gt; inside the
assessment</p>
<p>section of app/schools/international-award/page.tsx, replacing</p>
<p>the placeholder div.</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: The assessment renders on the page. Phase 1 collects
> lead data and advances to Phase 2. Questions appear one at a time with
> a progress indicator. Selecting an answer on Q4 advances to the
> placeholder results screen. The back button or progress indicator
> allows reviewing answers.**
>
> *Answer option cards should be visually distinct from each other and
> show a selected state when clicked. Large tap targets are important
> for mobile users.*
>
> *Do not submit to Resend yet. Phase 1 just needs to validate and
> advance. The API call is wired in Step 10.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 8</strong></p>
<p><strong>Assessment Results Logic and Copy</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>This step replaces the placeholder results screen with the real
logic. The tier recommendation is determined by the answer to Question
4. The results screen shows the recommended tier name, a personalised
summary, what is included, the price, and two action buttons.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># ASSESSMENT RESULTS LOGIC AND COPY</p>
<p>Update
components/schools/international-award/ExpeditionAssessment.tsx</p>
<p>to replace the Phase 3 placeholder with a real results screen.</p>
<p>RESULTS LOGIC</p>
<p>The recommended tier is determined by the answer to Q4 only:</p>
<p>Q4 answer A -&gt; BASE CAMP</p>
<p>Q4 answer B -&gt; TRAIL READY</p>
<p>Q4 answer C -&gt; SUMMIT PARTNER</p>
<p>Q4 answer D -&gt; TRAIL READY (default for unsure)</p>
<p>PERSONALISATION</p>
<p>If Q1 answer is D (exploring, not sure), prefix the results</p>
<p>headline with:</p>
<p>'Based on what you have shared, here is where most schools</p>
<p>in your position start.'</p>
<p>Otherwise use the standard headline for each tier.</p>
<p>RESULTS SCREEN - BASE CAMP</p>
<p>Headline: Your Recommended Setup: Base Camp</p>
<p>Summary: You are in a good position to run the expedition</p>
<p>yourself. What you need is reliable, quality equipment</p>
<p>that is delivered, set up, and collected without drama.</p>
<p>Includes:</p>
<p>- Tent rental for up to 100 students</p>
<p>- Sleeping bags, sleeping mats, and camping lights</p>
<p>- Equipment delivery and collection</p>
<p>- Setup guidance from our team</p>
<p>- Safety checklist document</p>
<p>Price: Starting from 3,000,000 Naira for up to 100 students</p>
<p>RESULTS SCREEN - TRAIL READY</p>
<p>Headline: Your Recommended Setup: Trail Ready</p>
<p>Summary: You need more than equipment. You need a structured</p>
<p>program delivered by people who know what they are doing.</p>
<p>Trail Ready puts our facilitators on-site alongside your</p>
<p>team so the expedition runs properly.</p>
<p>Includes:</p>
<p>- Everything in Base Camp</p>
<p>- Camping Nigeria facilitators on-site throughout</p>
<p>- Structured program: eco-awareness, team challenges,</p>
<p>evening experience</p>
<p>- Parent communication pack ready to send</p>
<p>- Post-event summary report</p>
<p>- Photo documentation</p>
<p>Price: Starting from 5,000,000 Naira for up to 100 students</p>
<p>RESULTS SCREEN - SUMMIT PARTNER</p>
<p>Headline: Your Recommended Setup: Summit Partner</p>
<p>Summary: You want it done. Summit Partner means you hand over</p>
<p>the operational weight and we carry it. Equipment,</p>
<p>facilitation, catering, first aid, certificates,</p>
<p>documentation. Your school provides a teacher on-site</p>
<p>and the student list. We handle the rest.</p>
<p>Includes:</p>
<p>- Everything in Trail Ready</p>
<p>- Full custom program design</p>
<p>- Catering coordination</p>
<p>- On-site first aid trained staff</p>
<p>- Branded participant certificates</p>
<p>- Professional photo and video recap</p>
<p>- Full written debrief with school leadership</p>
<p>- Priority annual slot</p>
<p>Price: Starting from 8,000,000 Naira for up to 100 students</p>
<p>TWO BUTTONS on every results screen:</p>
<p>Primary: 'Book a Call to Confirm This'</p>
<p>href='#' for now (calendar embed added in Step 11)</p>
<p>Secondary: 'Get a Proposal by Email'</p>
<p>href='/schools/proposal'</p>
<p>Add a small 'Start again' text link below the buttons that</p>
<p>resets the component back to Phase 1.</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: Completing all four questions produces the correct
> results screen for each Q4 answer. The correct tier name, summary,
> includes list, and price appear. The two action buttons render. The
> Start again link resets to Phase 1.**
>
> *Test all four Q4 paths before moving on: A should give Base Camp, B
> should give Trail Ready, C should give Summit Partner, D should give
> Trail Ready.*
>
> *The results screen should feel like a reward, not a form. Generous
> spacing, clear visual hierarchy, the tier name prominent.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 9</strong></p>
<p><strong>Resend API Route</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>This step creates the server-side API endpoint that receives the lead
data from the assessment and sends it as an email via Resend. The
assessment form in Step 10 will call this endpoint. Nothing in the
frontend changes in this step.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># RESEND API ROUTE</p>
<p>First check if resend is already installed by looking at
package.json.</p>
<p>If it is not installed, run: npm install resend</p>
<p>Create a new API route at:</p>
<p>app/api/assessment-lead/route.ts</p>
<p>This route should:</p>
<p>1. Accept POST requests only</p>
<p>2. Parse the JSON body expecting these fields:</p>
<p>name (string)</p>
<p>email (string)</p>
<p>school (string)</p>
<p>answers (object with q1, q2, q3, q4 keys)</p>
<p>recommended (string - the tier name)</p>
<p>3. Use the Resend SDK to send an internal notification email</p>
<p>FROM: onboarding@resend.dev (or the verified sending address</p>
<p>if one is already configured in the project)</p>
<p>TO: hello@campingnigeria.com</p>
<p>SUBJECT: New Expedition Assessment Lead - [name] from [school]</p>
<p>BODY (plain text or simple HTML):</p>
<p>New assessment submission</p>
<p>Name: [name]</p>
<p>Email: [email]</p>
<p>School: [school]</p>
<p>Recommended tier: [recommended]</p>
<p>Answers:</p>
<p>Q1 (Who are you): [q1]</p>
<p>Q2 (Running Award): [q2]</p>
<p>Q3 (Student count): [q3]</p>
<p>Q4 (Management level): [q4]</p>
<p>4. Also send a confirmation email to the person who submitted:</p>
<p>FROM: onboarding@resend.dev (or verified sender)</p>
<p>TO: [their email]</p>
<p>SUBJECT: Your Camping Nigeria Expedition Recommendation</p>
<p>BODY:</p>
<p>Hi [name],</p>
<p>Thank you for completing the assessment.</p>
<p>Based on your answers, we recommend our [recommended] package</p>
<p>for [school].</p>
<p>Our team will be in touch within 24 hours.</p>
<p>In the meantime, you can book a call directly at [calendar link</p>
<p>- use a placeholder URL for now].</p>
<p>The Camping Nigeria Schools Team</p>
<p>5. Return a 200 JSON response { success: true } on success</p>
<p>6. Return a 500 JSON response { error: '...' } on failure</p>
<p>The Resend API key should be read from process.env.RESEND_API_KEY</p>
<p>Do not hardcode the key.</p>
<p>If RESEND_API_KEY is not in .env.local, add a placeholder line:</p>
<p>RESEND_API_KEY=your_resend_api_key_here</p>
<p>and tell me so I can add the real key before testing.</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: The file app/api/assessment-lead/route.ts exists. It
> accepts POST requests. It references RESEND_API_KEY from environment
> variables. It sends two emails: one to hello@campingnigeria.com and
> one confirmation to the submitter. A note is returned telling you
> whether the API key needs to be added to .env.local.**
>
> *Do not test the live email send until Step 10 wires up the frontend.
> The route just needs to exist and be correctly structured at this
> point.*
>
> *If the project already has a Resend API route, ask Claude Code to
> show you its pattern before creating a new one, so the new route is
> consistent.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 10</strong></p>
<p><strong>Wire Assessment to API Route</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>This step connects the assessment frontend to the Resend API route.
When the user submits Phase 1 (lead capture), the data is posted to the
route along with the answers collected in Phase 2 and the recommended
tier from Phase 3 logic. The results screen should only render after the
API call succeeds.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># WIRE ASSESSMENT TO API</p>
<p>Update
components/schools/international-award/ExpeditionAssessment.tsx</p>
<p>When the user completes Q4 and the recommended tier is
determined:</p>
<p>1. Before rendering the results screen, POST to
/api/assessment-lead</p>
<p>with this payload:</p>
<p>{</p>
<p>name: (from Phase 1 lead data)</p>
<p>email: (from Phase 1 lead data)</p>
<p>school: (from Phase 1 lead data)</p>
<p>answers: {</p>
<p>q1: (answer to question 1)</p>
<p>q2: (answer to question 2)</p>
<p>q3: (answer to question 3)</p>
<p>q4: (answer to question 4)</p>
<p>},</p>
<p>recommended: (tier name as a string)</p>
<p>}</p>
<p>2. Show a brief loading state while the API call is in flight.</p>
<p>A simple spinner or 'Preparing your recommendation...' message.</p>
<p>3. On success (200 response): render the results screen for the</p>
<p>recommended tier.</p>
<p>4. On failure (non-200 response): still render the results screen</p>
<p>but show a subtle non-blocking message:</p>
<p>'We had trouble sending your confirmation email. Your results</p>
<p>are below. Please email hello@campingnigeria.com if you have</p>
<p>any issues.'</p>
<p>Do not block the results screen on API failure. The user should</p>
<p>always see their recommendation.</p>
<p>5. Do not make the API call again if the user uses 'Start again'</p>
<p>and resubmits. Only fire the API call once per session.</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: Completing the assessment triggers a POST to
> /api/assessment-lead. The correct payload is sent. A loading state
> appears briefly. The results screen renders. If you have a real Resend
> API key configured, the internal notification email arrives at
> hello@campingnigeria.com and a confirmation email arrives at the test
> email address used in the form.**
>
> *If you do not have a Resend API key yet, the API call will fail but
> the results screen should still render due to the failure fallback in
> point 4. Confirm this fallback works before adding the real key.*
>
> *To add your real Resend API key: open .env.local and replace the
> placeholder value with your key from the Resend dashboard. Restart the
> dev server after.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 11</strong></p>
<p><strong>Calendar Embed on Results Screen</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>This step adds the booking link to the results screen. The primary
CTA on every results screen is 'Book a Call to Confirm This'. This step
wires that button to a real calendar link and optionally embeds the
calendar inline so users can book without leaving the page.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># CALENDAR EMBED ON RESULTS SCREEN</p>
<p>You need a calendar booking URL before running this step.</p>
<p>Options (in order of simplicity):</p>
<p>A) Calendly - free tier available at calendly.com</p>
<p>B) Cal.com - open source alternative</p>
<p>C) A WhatsApp link as a fallback:</p>
<p>https://wa.me/2347040538528?text=I%20just%20completed%20the%20expedition%20assessment</p>
<p>If you have a calendar URL ready, replace [CALENDAR_URL] in the</p>
<p>prompt below with your actual URL.</p>
<p>If not, use the WhatsApp fallback for now.</p>
<p>Update the results screen in ExpeditionAssessment.tsx:</p>
<p>1. The primary 'Book a Call to Confirm This' button should link
to</p>
<p>[CALENDAR_URL] and open in a new tab.</p>
<p>2. If using Calendly: below the two buttons, add an inline
Calendly</p>
<p>embed using their standard embed script. The embed should show</p>
<p>the scheduling widget directly on the page so the user does not</p>
<p>need to navigate away.</p>
<p>Calendly inline embed documentation:</p>
<p>https://help.calendly.com/hc/en-us/articles/223147027</p>
<p>3. If using Cal.com: use their embed package.</p>
<p>Install with: npm install @calcom/embed-react</p>
<p>Then embed with &lt;Cal calLink='your-cal-link' /&gt;</p>
<p>4. If using WhatsApp fallback: the button should open the
WhatsApp</p>
<p>link in a new tab. No inline embed needed.</p>
<p>Also update the confirmation email body in
app/api/assessment-lead/route.ts</p>
<p>to replace the calendar placeholder URL with the real one.</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: The primary CTA button on every results screen has a
> working href. Clicking it opens the calendar or WhatsApp in a new tab.
> If using an inline embed, the scheduling widget is visible below the
> action buttons without scrolling too far.**
>
> *Calendly and Cal.com inline embeds require loading an external
> script. In Next.js App Router this means using next/script with
> strategy='lazyOnload' inside the client component.*
>
> *If the calendar embed feels too heavy on the page, the button-only
> approach (new tab) is a perfectly acceptable alternative. Do not
> over-engineer this step.*

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>STEP 12</strong></p>
<p><strong>Final Review and Deploy Check</strong></p></td>
</tr>
<tr>
<td><p><strong>What this step does</strong></p>
<p>Before pushing to Vercel, this step asks Claude Code to do a final
sweep of everything built in this sequence. It checks for broken links,
missing environment variables, TypeScript errors, and anything that
would cause a Vercel build failure.</p></td>
</tr>
</tbody>
</table>

**Paste this prompt into Claude Code:**

<table style="width:93%;">
<colgroup>
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><p># FINAL REVIEW AND DEPLOY CHECK</p>
<p>Please do a final review of everything built in this sequence.</p>
<p>Check each item below and report the status of each one.</p>
<p>1. ROUTING</p>
<p>- Does /schools/international-award resolve to the correct page?</p>
<p>- Does #assessment anchor scroll to the assessment section?</p>
<p>- Do all internal links (href='/schools',
href='/schools/proposal')</p>
<p>point to pages that exist?</p>
<p>2. EXTERNAL LINKS</p>
<p>- Do the links to intaward.org.ng and dofe.org have</p>
<p>target='_blank' and rel='noopener noreferrer'?</p>
<p>3. ASSESSMENT</p>
<p>- Does the lead capture form validate required fields?</p>
<p>- Does Q4 answer D produce a Trail Ready result?</p>
<p>- Does the Start Again link reset to Phase 1?</p>
<p>- Is the API call only fired once per session?</p>
<p>4. API ROUTE</p>
<p>- Does the route return 200 on success and 500 on error?</p>
<p>- Is RESEND_API_KEY read from environment variables only?</p>
<p>- Is there no hardcoded API key anywhere in the codebase?</p>
<p>Search for any string that looks like 're_' followed by</p>
<p>alphanumeric characters to confirm.</p>
<p>5. ENVIRONMENT VARIABLES</p>
<p>- List every environment variable the project now requires</p>
<p>- Confirm each one is in .env.local for local development</p>
<p>- Flag any that will also need to be added to Vercel</p>
<p>project settings before deploying</p>
<p>6. TYPESCRIPT</p>
<p>- Run tsc --noEmit and report any type errors</p>
<p>- If there are errors, fix them before continuing</p>
<p>7. BUILD TEST</p>
<p>- Run npm run build and confirm it completes without errors</p>
<p>- Report any warnings that look significant</p>
<p>After the report, tell me: is this ready to deploy to Vercel,</p>
<p>or is there anything that needs to be resolved first?</p></td>
</tr>
</tbody>
</table>

> **Checkpoint: Claude Code returns a clean report on all seven checks.
> TypeScript shows no errors. The build completes. All required
> environment variables are listed and you know which ones need to be
> added to Vercel before deploying.**
>
> *The most common deploy failure is a missing environment variable in
> Vercel. Before pushing, go to your Vercel project settings, find
> Environment Variables, and add RESEND_API_KEY with your real key.*
>
> *After deploying, test the full assessment flow on the live site
> before announcing it. Confirm the Resend emails arrive at
> hello@campingnigeria.com.*
>
> **After You Deploy**

Three things to do immediately after the page goes live.

**1. Test the Full User Journey**

- Visit campingnigeria.com/schools on a mobile device and confirm the
  DoE callout appears correctly and the link to
  /schools/international-award works

- Complete the full assessment as a principal (Q1: A, Q4: C) and confirm
  Summit Partner results appear and the confirmation email arrives

- Complete the assessment as a parent (Q1: B, Q4: D) and confirm Trail
  Ready results appear

- Confirm the internal notification email arrives at
  hello@campingnigeria.com with all four answers and the lead details

**2. Add the Vercel Environment Variable**

- Go to your Vercel project dashboard

- Settings \> Environment Variables

- Add RESEND_API_KEY with your real Resend API key

- Redeploy if you did not add it before the first deploy

**3. Share the Page Intentionally**

- Send /schools/international-award directly to the Award Coordinators
  and principals in your contact list - do not wait for organic traffic

- The assessment gives you a reason to reach out: 'We built something
  specifically for schools running the DoE program. Takes two minutes
  and shows you what you need.'

- Every completed assessment goes to hello@campingnigeria.com with full
  details. Respond within 24 hours while the intent is warm.

> **Common Problems and Fixes**

|  |  |
|:--:|:--:|
| **Problem** | **What to do** |
| **Tailwind classes not applying on new components** | Check the content array in tailwind.config includes the new file paths, e.g. './components/schools/\*\*/\*.tsx'. Run the dev server again after updating. |
| **The DoE callout appears in the wrong place on /schools** | Go back to Step 4. Ask Claude Code to show you the current JSX of the schools page and confirm the placement is between the correct two sections. |
| **Assessment resets when the page is refreshed** | This is expected behaviour. The assessment state lives in component memory, not in a URL or localStorage. If persistence across refreshes is important, raise it as a separate request. |
| **Resend email not arriving** | Check that RESEND_API_KEY is set in both .env.local and Vercel Environment Variables. Check the Resend dashboard logs for the send attempt. Confirm the FROM address is verified in your Resend account. |
| **Vercel build fails with type errors** | Run npm run build locally first. Fix all TypeScript errors before pushing. Common issue: missing type on the answers object or untyped API response. |
| **Calendar embed not loading** | External embeds need next/script with strategy='lazyOnload'. If the script loads before the DOM is ready it will fail silently. Check the browser console for errors. |

**Camping Nigeria. Adventure Made Simple.**

campingnigeria.com
