---
title: "How to Use HTML to Open a Link in a New Tab"
source: "https://www.freecodecamp.org/news/how-to-use-html-to-open-link-in-new-tab/"
author:
  - "[[Kristofer Koishigawa]]"
published: 2020-09-08
created: 2025-09-07
description: "Tabs are great, aren't they? They allow the multitasker in all of us to juggle a bunch of online tasks at the same time. Tabs are so common now that, when you click on a link, it's likely it'll open in a new tab. If you've ever wondered how to"
tags:
  - "clippings"
---
The Target Attribute

This attribute tells the browser how to open the link.

To open a link in a new tab, just set the `target` attribute to `_blank`:

```html
<p\>Check out <a href\="https://www.freecodecamp.org/" target\="\_blank"\>freeCodeCamp</a\>.</p\>
```

Now when someone clicks on the link, it will open up in a new tab, or possibly a new window depending on the person's browser settings.

Security concerns with `target="_blank"`

I strongly recommend that you always add `rel="noreferrer noopener"` to the anchor element whenever you use the `target` attribute:

```html
<p\>Check out <a href\="https://www.freecodecamp.org/" target\="\_blank" rel\="noopener noreferrer"\>freeCodeCamp</a\>.</p\>
```


This results in the following output:

Check out [freeCodeCamp](https://www.freecodecamp.org/).

The `rel` attribute sets the relationship between your page and the linked URL. Setting it to `noopener noreferrer` is to prevent a type of phishing known as [tabnabbing](https://en.wikipedia.org/wiki/Tabnabbing).

What is tabnabbing?

Tabnabbing, sometimes called reverse tabnabbing, is an exploit that uses the browser's default behavior with `target="_blank"` to gain partial access to your page through the `window.object` API.

With tabnabbing, a page that you link to could cause your page to redirect to a fake login page. This would be hard for most users to notice because the focus would be on the tab that just opened – not the original tab with your page.

Then when a person switches back to the tab with your page, they would see the fake login page instead and might enter their login details.

If you're interested in learning more about how tabnabbing works and what bad actors can do with the exploit, check out [Alex Yumashev's article](https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/) and this one by [OWASP](https://owasp.org/www-community/attacks/Reverse_Tabnabbing).

If you'd like to see a *safe* working example, check out this [page](https://mathiasbynens.github.io/rel-noopener/) and its [GitHub repo](https://github.com/mathiasbynens/rel-noopener) for more information about the exploit and the `rel` attribute.