import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MigratePage() {
  const headersList = await headers();
  const newLocation = headersList.get("x-new-location") ?? "";

  if (!newLocation) {
    redirect("/");
  }

  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>域名迁移通知 - CollectUI</title>
        <link rel="icon" href="/logo.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: inline styles for standalone page
          dangerouslySetInnerHTML={{
            __html: `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#fafafa;--bg-card:#fff;--text:#0a0a0a;--text-secondary:#525252;--text-muted:#a3a3a3;
  --accent:#171717;--accent-hover:#262626;--border:#e5e5e5;
  --radius:12px;--font:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;
}
@media(prefers-color-scheme:dark){
  :root{
    --bg:#0a0a0a;--bg-card:#171717;--text:#fafafa;--text-secondary:#a3a3a3;--text-muted:#525252;
    --accent:#fafafa;--accent-hover:#e5e5e5;--border:#262626;
  }
}
html{height:100%}
body{
  min-height:100%;display:flex;align-items:center;justify-content:center;
  background:var(--bg);color:var(--text);font-family:var(--font);
  -webkit-font-smoothing:antialiased;
}
.card{
  width:100%;max-width:420px;margin:24px;padding:40px 32px;
  background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);
  text-align:center;position:relative;overflow:hidden;
}
.card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--text-muted),transparent);
  opacity:.5;
}
.logo{
  width:48px;height:48px;margin:0 auto 28px;border-radius:10px;
  background:var(--text);display:flex;align-items:center;justify-content:center;
}
.logo svg{width:24px;height:24px;color:var(--bg)}
h1{font-size:18px;font-weight:600;margin-bottom:8px;letter-spacing:-.01em}
.desc{font-size:14px;line-height:1.6;color:var(--text-secondary);margin-bottom:32px}
.desc strong{color:var(--text);font-weight:600}
.btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:10px 24px;background:var(--accent);color:var(--bg);
  font-size:14px;font-weight:600;font-family:var(--font);
  border:none;border-radius:8px;cursor:pointer;
  text-decoration:none;transition:background .15s,transform .1s;
}
.btn:hover{background:var(--accent-hover);transform:translateY(-1px)}
.btn svg{width:16px;height:16px}
.countdown{
  margin-top:24px;font-size:13px;color:var(--text-muted);
  font-variant-numeric:tabular-nums;
}
.countdown span{font-weight:600;color:var(--text-secondary)}
footer{
  position:fixed;bottom:20px;left:0;right:0;text-align:center;
  font-size:12px;color:var(--text-muted);
}
`,
          }}
        />
      </head>
      <body>
        <div className="card">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1>域名迁移通知</h1>
          <p className="desc">
            CollectUI 已迁移至新域名
            <br />
            <strong>collectui.youquxing.com</strong>
          </p>
          <a className="btn" href={newLocation}>
            前往新地址
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <p className="countdown">
            页面将在 <span id="cd">30</span> 秒后自动跳转
          </p>
        </div>

        <footer>CollectUI</footer>

        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: countdown timer
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  var s=30,el=document.getElementById('cd');
  var t=setInterval(function(){
    s--;el.textContent=s;
    if(s<=0){clearInterval(t);window.location.href="${newLocation}";}
  },1000);
})();
`,
          }}
        />
      </body>
    </html>
  );
}
