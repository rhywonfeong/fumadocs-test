import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1 gap-6">
      <h1 className="text-4xl font-bold tracking-tight">hpsetup</h1>
      <p className="text-lg text-fd-muted-foreground max-w-md mx-auto">
        一条命令安装 HeroUI Pro 全部组件，无需 GitHub 登录，支持所有包管理器。
      </p>
      <div className="flex flex-row gap-3 justify-center">
        <Link
          href="/docs/getting-started"
          className="rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
        >
          快速开始
        </Link>
        <Link
          href="/docs"
          className="rounded-lg border border-fd-border px-5 py-2.5 text-sm font-medium hover:bg-fd-accent transition-colors"
        >
          查看文档
        </Link>
      </div>
    </div>
  );
}
