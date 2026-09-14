const DEFAULT_POSTS = [
{id:"1",title:"ChatGPT দিয়ে প্রতিদিনের কাজ সহজ করার ৭টি উপায়",slug:"chatgpt-7-tips",category:"AI & Technology",image:"🤖",excerpt:"AI কীভাবে পড়াশোনা, কাজ ও দৈনন্দিন জীবনে সময় বাঁচাতে সাহায্য করতে পারে তার ৭টি সহজ উপায়।",content:"AI এখন শুধু প্রযুক্তি বিশেষজ্ঞদের জন্য নয়। সঠিকভাবে ব্যবহার করলে ChatGPT অনেক কাজ সহজ করতে পারে।\n\nকোনো লেখা শুরু করতে সমস্যা হলে outline তৈরি করতে বলতে পারেন।\n\nকঠিন বিষয় সহজ ভাষায় বুঝতে, আইডিয়া তৈরি করতে এবং শেখার roadmap বানাতেও AI সহায়ক।\n\nতবে গুরুত্বপূর্ণ তথ্য অবশ্যই নির্ভরযোগ্য উৎস দিয়ে যাচাই করুন।",status:"published",createdAt:"2026-09-14"},
{id:"2",title:"ফোন ধীর হয়ে গেলে যে ৫টি কাজ আগে করবেন",slug:"phone-slow-5-tips",category:"Mobile Tips",image:"📱",excerpt:"স্মার্টফোনের পারফরম্যান্স ভালো রাখার কয়েকটি সহজ কৌশল।",content:"অপ্রয়োজনীয় অ্যাপ ও ফাইল সরিয়ে জায়গা খালি রাখুন।\n\nঅ্যাপ ও অপারেটিং সিস্টেম আপডেট রাখুন।\n\nঅজানা উৎস থেকে অ্যাপ ইনস্টল করা এড়িয়ে চলুন।",status:"published",createdAt:"2026-09-13"},
{id:"3",title:"কাজের গতি বাড়াতে ১০টি দরকারি ফ্রি অনলাইন টুল",slug:"free-online-tools",category:"Online Tools",image:"💻",excerpt:"পড়াশোনা, কাজ ও কনটেন্ট তৈরিতে কাজে লাগতে পারে এমন কিছু অনলাইন টুল।",content:"অনলাইন টুল বেছে নেওয়ার সময় privacy, pricing এবং terms দেখে নিন।\n\nএকই কাজের একাধিক টুল তুলনা করে আপনার প্রয়োজন অনুযায়ী ব্যবহার করুন।",status:"published",createdAt:"2026-09-12"},
{id:"4",title:"অনলাইনে নিজের অ্যাকাউন্ট নিরাপদ রাখার সহজ নিয়ম",slug:"online-security-basics",category:"Security",image:"🔐",excerpt:"অনলাইন নিরাপত্তার জন্য গুরুত্বপূর্ণ কয়েকটি অভ্যাস।",content:"প্রতিটি গুরুত্বপূর্ণ অ্যাকাউন্টে আলাদা শক্তিশালী password ব্যবহার করুন।\n\nসম্ভব হলে two-factor authentication চালু করুন।\n\nসন্দেহজনক link ও attachment এড়িয়ে চলুন।",status:"published",createdAt:"2026-09-11"},
{id:"5",title:"২০২৬ সালের আলোচিত প্রযুক্তি ট্রেন্ড",slug:"tech-trends-2026",category:"Trending",image:"🚀",excerpt:"প্রযুক্তির দুনিয়ায় আলোচিত কিছু ট্রেন্ড সম্পর্কে সংক্ষিপ্ত ধারণা।",content:"AI, automation এবং privacy-focused technology নিয়ে আগ্রহ বাড়ছে।\n\nনতুন প্রযুক্তি ব্যবহারের আগে নিরাপত্তা ও ব্যবহারকারীর গোপনীয়তা বিবেচনা করুন।",status:"published",createdAt:"2026-09-10"}
];

function getPosts(){
  const saved=localStorage.getItem("bth_posts");
  if(saved) return JSON.parse(saved);
  localStorage.setItem("bth_posts",JSON.stringify(DEFAULT_POSTS));
  return [...DEFAULT_POSTS];
}
function savePosts(posts){localStorage.setItem("bth_posts",JSON.stringify(posts));}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function card(p){
  return `<article class="post-card"><div class="post-image">${p.image?.startsWith("http")?`<img src="${esc(p.image)}" alt="">`:esc(p.image||"📰")}</div><div class="post-body"><span class="tag">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><a class="read-more" href="article.html?slug=${encodeURIComponent(p.slug)}">বিস্তারিত পড়ুন →</a></div></article>`;
}
function loadLatestPosts(id,limit=6){
  const el=document.getElementById(id); if(!el)return;
  const posts=getPosts().filter(p=>p.status==="published").sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,limit);
  el.innerHTML=posts.map(card).join("")||'<p class="muted">কোনো পোস্ট নেই।</p>';
}
function loadCategory(){
  const cat=new URLSearchParams(location.search).get("cat")||"AI & Technology";
  document.getElementById("catTitle").textContent=cat;
  const posts=getPosts().filter(p=>p.status==="published"&&p.category===cat);
  document.getElementById("categoryPosts").innerHTML=posts.map(card).join("")||'<p class="muted">এই ক্যাটাগরিতে এখনো কোনো পোস্ট নেই।</p>';
}
function runSearch(){
  const input=document.getElementById("searchInput"),out=document.getElementById("searchResults"); if(!input||!out)return;
  const q=input.value.trim().toLowerCase();
  const posts=getPosts().filter(p=>p.status==="published"&&(!q||`${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q)));
  out.innerHTML=posts.map(card).join("")||'<p class="muted">কোনো ফলাফল পাওয়া যায়নি।</p>';
}
function loadArticle(){
  const slug=new URLSearchParams(location.search).get("slug")||"chatgpt-7-tips";
  const p=getPosts().find(x=>x.slug===slug&&x.status==="published");
  const root=document.getElementById("articleRoot");
  if(!p){root.innerHTML='<div class="form-card"><h1>পোস্ট পাওয়া যায়নি</h1><a href="index.html">হোমে ফিরে যান</a></div>';return;}
  document.title=p.title+" | Bangla Trend Hub";
  root.innerHTML=`<article class="article-main"><span class="tag">${esc(p.category)}</span><h1>${esc(p.title)}</h1><div class="article-meta">প্রকাশিত: ${esc(p.createdAt)} · Bangla Trend Hub</div><div class="article-cover">${p.image?.startsWith("http")?`<img src="${esc(p.image)}" alt="">`:esc(p.image||"📰")}</div><p class="lead">${esc(p.excerpt)}</p>${p.content.split(/\n+/).filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join("")}<div class="share-box"><button class="btn btn-primary" onclick="shareArticle('${esc(p.title)}')">📤 শেয়ার</button></div></article><aside><div class="ad-box">Adsterra Ad</div><div class="sidebar-card"><h3>জনপ্রিয়</h3>${getPosts().slice(0,4).map(x=>`<a href="article.html?slug=${encodeURIComponent(x.slug)}">${esc(x.title)}</a>`).join("")}</div></aside>`;
}
async function shareArticle(title){
  if(navigator.share) await navigator.share({title,url:location.href});
  else {await navigator.clipboard?.writeText(location.href);alert("লিংক কপি হয়েছে।");}
}
function requireAdmin(){if(localStorage.getItem("bth_admin")!=="1") location.href="login.html";}
function logout(){localStorage.removeItem("bth_admin");location.href="login.html";}
function updateStats(){
  const p=getPosts(); document.getElementById("postCount").textContent=p.length;
  document.getElementById("publishedCount").textContent=p.filter(x=>x.status==="published").length;
  document.getElementById("draftCount").textContent=p.filter(x=>x.status==="draft").length;
}
function renderAdminPosts(){
  const out=document.getElementById("adminPosts"); if(!out)return;
  const q=(document.getElementById("adminSearch")?.value||"").toLowerCase();
  const posts=getPosts().filter(p=>`${p.title} ${p.category}`.toLowerCase().includes(q));
  out.innerHTML=posts.map(p=>`<div class="admin-row"><div><strong>${esc(p.title)}</strong><small>${esc(p.category)} · ${esc(p.status)}</small></div><div class="row-actions"><a class="small-btn" href="../article.html?slug=${encodeURIComponent(p.slug)}">View</a><a class="small-btn" href="post-editor.html?id=${p.id}">Edit</a><button class="small-btn danger" onclick="deletePost('${p.id}')">Delete</button></div></div>`).join("")||'<p class="muted">কোনো পোস্ট নেই।</p>';
}
function deletePost(id){
  if(!confirm("এই পোস্টটি মুছে ফেলবেন?"))return;
  savePosts(getPosts().filter(p=>p.id!==id));renderAdminPosts();updateStats();
}
function slugify(s){return s.toLowerCase().trim().replace(/[^a-z0-9\u0980-\u09ff]+/g,"-").replace(/^-+|-+$/g,"")||"post-"+Date.now();}
function initEditor(){
  const id=new URLSearchParams(location.search).get("id");
  const posts=getPosts(), p=id?posts.find(x=>x.id===id):null;
  if(p){
    document.getElementById("editorTitle").textContent="পোস্ট সম্পাদনা";
    ["postTitle","postSlug","postCategory","postImage","postExcerpt","postContent","postStatus"].forEach((k,i)=>{document.getElementById(k).value=p[{postTitle:"title",postSlug:"slug",postCategory:"category",postImage:"image",postExcerpt:"excerpt",postContent:"content",postStatus:"status"}[k]]||""});
  }
  document.getElementById("postForm").addEventListener("submit",e=>{
    e.preventDefault();
    const data={id:p?.id||Date.now().toString(),title:postTitle.value.trim(),slug:postSlug.value.trim()||slugify(postTitle.value),category:postCategory.value,image:postImage.value.trim()||"📰",excerpt:postExcerpt.value.trim(),content:postContent.value.trim(),status:postStatus.value,createdAt:p?.createdAt||new Date().toISOString().slice(0,10)};
    const next=p?posts.map(x=>x.id===p.id?data:x):[data,...posts];savePosts(next);
    document.getElementById("saveMsg").textContent="পোস্ট সংরক্ষণ হয়েছে।";
    setTimeout(()=>location.href="dashboard.html",600);
  });
}
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("year")&&(document.getElementById("year").textContent=new Date().getFullYear());
  const btn=document.querySelector(".menu-btn"),nav=document.querySelector(".nav");
  if(btn&&nav)btn.onclick=()=>nav.classList.toggle("open");
  const cf=document.getElementById("contactForm");
  if(cf)cf.onsubmit=e=>{e.preventDefault();alert("Demo: বার্তাটি গ্রহণ করা হয়েছে। বাস্তবে backend/form service সংযুক্ত করুন।");cf.reset();};
  const sf=document.getElementById("subscribeForm");
  if(sf)sf.onsubmit=e=>{e.preventDefault();alert("ধন্যবাদ! Demo subscription সফল হয়েছে।");sf.reset();};
});