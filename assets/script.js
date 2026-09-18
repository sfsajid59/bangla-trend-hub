const SUPABASE_URL =
  window.SUPABASE_URL || "cyhzgnrtdpxhpzcyqcdj";

const SUPABASE_ANON_KEY =
  window.SUPABASE_ANON_KEY || "sb_publishable_vNfvxmtXFzV9M4w049G9aA_i8I-o43d";
/* =========================================================
   BANGLA TREND HUB
   Supabase-powered script.js
   localStorage removed
   ========================================================= */

/*
  IMPORTANT:
  Your HTML must load Supabase JS before this file.

  Example:
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  Then either define:
    window.SUPABASE_URL
    window.SUPABASE_ANON_KEY

  OR replace the two values below.
*/

const SUPABASE_URL =
  window.SUPABASE_URL || "YOUR_SUPABASE_PROJECT_URL";

const SUPABASE_ANON_KEY =
  window.SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

let db = null;


/* =========================================================
   SUPABASE INIT
   ========================================================= */

function initSupabase() {
  if (db) return db;

  if (
    typeof window.supabase === "undefined" ||
    typeof window.supabase.createClient !== "function"
  ) {
    console.error("Supabase JS library is not loaded.");
    return null;
  }

  if (
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY ||
    SUPABASE_URL.startsWith("YOUR_") ||
    SUPABASE_ANON_KEY.startsWith("YOUR_")
  ) {
    console.error("Supabase URL / Anon Key is missing.");
    return null;
  }

  db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  return db;
}


/* =========================================================
   HELPERS
   ========================================================= */

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0980-\u09FF]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


function getImage(post) {
  const image = post?.image_url || "";

  if (!image) {
    return "";
  }

  return image;
}


function card(post) {
  const image = getImage(post);

  return `
    <article class="post-card">

      <div class="post-image">
        ${
          image.startsWith("http")
            ? `<img src="${esc(image)}" alt="${esc(post.title)}">`
            : esc(image || "📰")
        }
      </div>

      <div class="post-card-body">

        <span class="tag">
          ${esc(post.category || "")}
        </span>

        <h3>
          <a href="article.html?slug=${encodeURIComponent(post.slug)}">
            ${esc(post.title)}
          </a>
        </h3>

        <p>
          ${esc(post.excerpt || "")}
        </p>

        <a class="read-more"
           href="article.html?slug=${encodeURIComponent(post.slug)}">
          বিস্তারিত পড়ুন →
        </a>

      </div>

    </article>
  `;
}


/* =========================================================
   GET POSTS FROM SUPABASE
   ========================================================= */

async function getPosts(options = {}) {
  const client = initSupabase();

  if (!client) return [];

  let query = client
    .from("posts")
    .select("*");

  if (options.publishedOnly) {
    query = query
      .eq("status", "published")
      .eq("published", true);
  }

  if (options.category) {
    query = query.eq("category", options.category);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  query = query.order("created_at", {
    ascending: false
  });

  const { data, error } = await query;

  if (error) {
    console.error("Supabase getPosts error:", error);
    return [];
  }

  return data || [];
}


/* =========================================================
   LATEST POSTS
   ========================================================= */

async function loadLatestPosts(id, limit = 6) {
  const el = document.getElementById(id);

  if (!el) return;

  const posts = await getPosts({
    publishedOnly: true,
    limit
  });

  el.innerHTML =
    posts.length
      ? posts.map(card).join("")
      : '<p class="muted">কোনো পোস্ট নেই।</p>';
}


/* =========================================================
   CATEGORY PAGE
   ========================================================= */

async function loadCategory() {
  const cat =
    new URLSearchParams(location.search).get("cat") ||
    "AI & Technology";

  const title = document.getElementById("catTitle");

  if (title) {
    title.textContent = cat;
  }

  const posts = await getPosts({
    publishedOnly: true,
    category: cat
  });

  const out = document.getElementById("categoryPosts");

  if (!out) return;

  out.innerHTML =
    posts.length
      ? posts.map(card).join("")
      : '<p class="muted">এই ক্যাটাগরিতে এখনো কোনো পোস্ট নেই।</p>';
}


/* =========================================================
   SEARCH
   ========================================================= */

async function runSearch() {
  const input =
    document.getElementById("searchInput");

  const out =
    document.getElementById("searchResults");

  if (!input || !out) return;

  const q = input.value.trim().toLowerCase();

  if (!q) {
    out.innerHTML =
      '<p class="muted">অনুসন্ধানের জন্য কিছু লিখুন।</p>';
    return;
  }

  const posts = await getPosts({
    publishedOnly: true
  });

  const results = posts.filter(post => {

    const text = [
      post.title,
      post.excerpt,
      post.category,
      post.content
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(q);
  });

  out.innerHTML =
    results.length
      ? results.map(card).join("")
      : '<p class="muted">কোনো ফলাফল পাওয়া যায়নি।</p>';
}


/* =========================================================
   SINGLE ARTICLE
   ========================================================= */

async function loadArticle() {
  const slug =
    new URLSearchParams(location.search).get("slug") ||
    "chatgpt-7-tips";

  const client = initSupabase();

  if (!client) return;

  const { data: post, error } = await client
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("published", true)
    .maybeSingle();

  const root =
    document.getElementById("articleRoot");

  if (!root) return;

  if (error) {
    console.error("Article loading error:", error);

    root.innerHTML = `
      <div class="form-card">
        <h1>পোস্ট লোড করা যায়নি</h1>
        <p>Supabase থেকে Article পাওয়া যায়নি।</p>
      </div>
    `;

    return;
  }

  if (!post) {
    root.innerHTML = `
      <div class="form-card">
        <h1>পোস্ট পাওয়া যায়নি</h1>
        <a href="index.html">হোমে ফিরে যান</a>
      </div>
    `;

    return;
  }

  document.title =
    `${post.title} | Bangla Trend Hub`;

  root.innerHTML = `
    <article class="article-main">

      <span class="tag">
        ${esc(post.category || "")}
      </span>

      <h1>
        ${esc(post.title)}
      </h1>

      <div class="article-meta">
        প্রকাশিত:
        ${post.created_at
          ? new Date(post.created_at).toLocaleDateString("bn-BD")
          : ""}
      </div>

      ${
        post.image_url
          ? `
            <div class="article-image">
              <img
                src="${esc(post.image_url)}"
                alt="${esc(post.title)}"
              >
            </div>
          `
          : ""
      }

      ${
        post.excerpt
          ? `<p class="article-excerpt">
              ${esc(post.excerpt)}
            </p>`
          : ""
      }

      <div class="article-content">
        ${post.content || ""}
      </div>

    </article>
  `;
}


/* =========================================================
   SHARE
   ========================================================= */

async function shareArticle(title) {

  if (navigator.share) {

    await navigator.share({
      title,
      url: location.href
    });

    return;
  }

  if (navigator.clipboard) {

    await navigator.clipboard.writeText(
      location.href
    );

    alert("লিংক কপি হয়েছে।");

    return;
  }

  alert("লিংক কপি করা যাচ্ছে না।");
}


/* =========================================================
   ADMIN AUTH
   ========================================================= */

async function requireAdmin() {

  const client = initSupabase();

  if (!client) return false;

  const {
    data: { session }
  } = await client.auth.getSession();

  if (!session) {

    location.href = "login.html";

    return false;
  }

  return true;
}


async function logout() {

  const client = initSupabase();

  if (!client) return;

  await client.auth.signOut();

  location.href = "login.html";
}


/* =========================================================
   ADMIN STATS
   ========================================================= */

async function updateStats() {

  const posts = await getPosts();

  const postCount =
    document.getElementById("postCount");

  const publishedCount =
    document.getElementById("publishedCount");

  const draftCount =
    document.getElementById("draftCount");

  if (postCount) {
    postCount.textContent = posts.length;
  }

  if (publishedCount) {
    publishedCount.textContent =
      posts.filter(
        p => p.status === "published"
      ).length;
  }

  if (draftCount) {
    draftCount.textContent =
      posts.filter(
        p => p.status === "draft"
      ).length;
  }
}


/* =========================================================
   ADMIN POST LIST
   ========================================================= */

async function renderAdminPosts() {

  const out =
    document.getElementById("adminPosts");

  if (!out) return;

  const search =
    document.getElementById("adminSearch");

  const q =
    search?.value?.trim().toLowerCase() || "";

  const posts = await getPosts();

  const filtered = posts.filter(post => {

    const text = [
      post.title,
      post.category,
      post.status
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(q);
  });

  out.innerHTML = filtered.map(post => `

    <div class="admin-row">

      <div>
        <strong>
          ${esc(post.title)}
        </strong>

        <small>
          ${esc(post.category || "")}
          -
          ${esc(post.status || "")}
        </small>
      </div>

      <div class="admin-actions">

        <a
          href="editor.html?id=${encodeURIComponent(post.id)}"
        >
          Edit
        </a>

        <button
          type="button"
          onclick="deletePost('${esc(post.id)}')"
        >
          Delete
        </button>

      </div>

    </div>

  `).join("");

  if (!filtered.length) {
    out.innerHTML =
      '<p class="muted">কোনো পোস্ট পাওয়া যায়নি।</p>';
  }
}


/* =========================================================
   DELETE POST
   ========================================================= */

async function deletePost(id) {

  if (!confirm("এই পোস্টটি মুছে ফেলবেন?")) {
    return;
  }

  const client = initSupabase();

  if (!client) return;

  const { error } = await client
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {

    console.error("Delete error:", error);

    alert(
      "পোস্ট মুছতে সমস্যা হয়েছে:\n" +
      error.message
    );

    return;
  }

  alert("পোস্ট মুছে ফেলা হয়েছে।");

  await renderAdminPosts();
  await updateStats();
}


/* =========================================================
   EDITOR
   ========================================================= */

async function initEditor() {

  const form =
    document.getElementById("postForm");

  if (!form) return;

  const client = initSupabase();

  if (!client) return;

  const id =
    new URLSearchParams(location.search).get("id");

  let existingPost = null;

  if (id) {

    const { data, error } = await client
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Load editor post error:", error);

      alert(
        "Article লোড করা যায়নি:\n" +
        error.message
      );

      return;
    }

    existingPost = data;
  }


  /* -------------------------------------------------------
     FILL EDITOR
     ------------------------------------------------------- */

  if (existingPost) {

    const editorTitle =
      document.getElementById("editorTitle");

    if (editorTitle) {
      editorTitle.textContent =
        "পোস্ট সম্পাদনা";
    }

    const fields = {
      postTitle: existingPost.title || "",
      postSlug: existingPost.slug || "",
      postCategory: existingPost.category || "",
      postImage: existingPost.image_url || "",
      postExcerpt: existingPost.excerpt || "",
      postContent: existingPost.content || "",
      postStatus: existingPost.status || "draft"
    };

    Object.entries(fields).forEach(
      ([key, value]) => {

        const el =
          document.getElementById(key);

        if (el) {
          el.value = value;
        }
      }
    );
  }


  /* -------------------------------------------------------
     SUBMIT
     ------------------------------------------------------- */

  form.addEventListener("submit", async e => {

    e.preventDefault();

    const title =
      document.getElementById("postTitle")
        ?.value.trim() || "";

    const slugInput =
      document.getElementById("postSlug");

    const category =
      document.getElementById("postCategory")
        ?.value.trim() || "";

    const imageUrl =
      document.getElementById("postImage")
        ?.value.trim() || "";

    const excerpt =
      document.getElementById("postExcerpt")
        ?.value.trim() || "";

    const content =
      document.getElementById("postContent")
        ?.value || "";

    const status =
      document.getElementById("postStatus")
        ?.value || "draft";


    if (!title) {

      alert("Article title দিন।");

      return;
    }


    const slug =
      slugInput?.value.trim() ||
      slugify(title);


    /* -------------------------------------------------------
       GET CURRENT USER
       ------------------------------------------------------- */

    const {
      data: { user }
    } = await client.auth.getUser();


    /* -------------------------------------------------------
       SUPABASE DATA
       ------------------------------------------------------- */

    const articleData = {

      title,

      slug,

      category,

      image_url: imageUrl || null,

      excerpt,

      content,

      status,

      published: status === "published",

      updated_at: new Date().toISOString()

    };


    /*
      author_id only added when a logged-in user exists.
      This avoids inserting an invalid UUID.
    */

    if (user?.id) {
      articleData.author_id = user.id;
    }


    /* -------------------------------------------------------
       UPDATE EXISTING ARTICLE
       ------------------------------------------------------- */

    if (existingPost?.id) {

      const { error } = await client
        .from("posts")
        .update(articleData)
        .eq("id", existingPost.id);

      if (error) {

        console.error(
          "Supabase update error:",
          error
        );

        alert(
          "Article Update করা যায়নি:\n" +
          error.message
        );

        return;
      }

    }


    /* -------------------------------------------------------
       CREATE NEW ARTICLE
       ------------------------------------------------------- */

    else {

      /*
        Do NOT send id.
        Supabase/Postgres will generate UUID
        automatically if id has a default gen_random_uuid().
      */

      const insertData = {
        ...articleData
      };

      delete insertData.updated_at;

      const { error } = await client
        .from("posts")
        .insert(insertData);

      if (error) {

        console.error(
          "Supabase insert error:",
          error
        );

        alert(
          "Article Save করা যায়নি:\n" +
          error.message
        );

        return;
      }
    }


    /* -------------------------------------------------------
       SUCCESS
       ------------------------------------------------------- */

    const saveMsg =
      document.getElementById("saveMsg");

    if (saveMsg) {
      saveMsg.textContent =
        existingPost
          ? "পোস্ট সফলভাবে Update হয়েছে।"
          : "পোস্ট সফলভাবে Save হয়েছে।";
    } else {

      alert(
        existingPost
          ? "পোস্ট Update হয়েছে।"
          : "পোস্ট Save হয়েছে।"
      );
    }


    setTimeout(() => {

      location.href = "dashboard.html";

    }, 700);

  });
}


/* =========================================================
   AUTO SLUG
   ========================================================= */

function setupSlug() {

  const title =
    document.getElementById("postTitle");

  const slug =
    document.getElementById("postSlug");

  if (!title || !slug) return;

  title.addEventListener("input", () => {

    if (!slug.dataset.manual) {
      slug.value = slugify(title.value);
    }

  });

  slug.addEventListener("input", () => {
    slug.dataset.manual = "true";
  });
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    const year =
      document.getElementById("year");

    if (year) {
      year.textContent =
        new Date().getFullYear();
    }


    /* Mobile menu */

    const btn =
      document.querySelector(".menu-btn");

    const nav =
      document.querySelector(".nav");

    if (btn && nav) {

      btn.addEventListener("click", () => {
        nav.classList.toggle("open");
      });

    }


    /* Homepage */

    if (
      document.getElementById("latestPosts")
    ) {
      await loadLatestPosts(
        "latestPosts",
        6
      );
    }


    /* Category */

    if (
      document.getElementById("categoryPosts")
    ) {
      await loadCategory();
    }


    /* Search */

    const searchBtn =
      document.getElementById("searchBtn");

    if (searchBtn) {
      searchBtn.addEventListener(
        "click",
        runSearch
      );
    }


    const searchInput =
      document.getElementById("searchInput");

    if (searchInput) {

      searchInput.addEventListener(
        "keydown",
        e => {

          if (e.key === "Enter") {
            runSearch();
          }

        }
      );

    }


    /* Article */

    if (
      document.getElementById("articleRoot")
    ) {
      await loadArticle();
    }


    /* Dashboard */

    if (
      document.getElementById("adminPosts")
    ) {
      await renderAdminPosts();
      await updateStats();
    }


    /* Admin search */

    const adminSearch =
      document.getElementById("adminSearch");

    if (adminSearch) {

      adminSearch.addEventListener(
        "input",
        renderAdminPosts
      );

    }


    /* Editor */

    if (
      document.getElementById("postForm")
    ) {
      await initEditor();
      setupSlug();
    }


    /* Contact form */

    const contactForm =
      document.getElementById("contactForm");

    if (contactForm) {

      contactForm.addEventListener(
        "submit",
        e => {

          e.preventDefault();

          alert(
            "বার্তাটি গ্রহণ করা হয়েছে।"
          );

          contactForm.reset();

        }
      );

    }


    /* Subscribe */

    const subscribeForm =
      document.getElementById("subscribeForm") ||
      document.getElementById("subscribe-form");

    if (subscribeForm) {

      subscribeForm.addEventListener(
        "submit",
        e => {

          e.preventDefault();

          alert(
            "ধন্যবাদ! Subscription সফল হয়েছে।"
          );

          subscribeForm.reset();

        }
      );

    }

  }
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.loadLatestPosts = loadLatestPosts;
window.loadCategory = loadCategory;
window.runSearch = runSearch;
window.loadArticle = loadArticle;
window.shareArticle = shareArticle;
window.requireAdmin = requireAdmin;
window.logout = logout;
window.updateStats = updateStats;
window.renderAdminPosts = renderAdminPosts;
window.deletePost = deletePost;
window.initEditor = initEditor;
window.setupSlug = setupSlug;
